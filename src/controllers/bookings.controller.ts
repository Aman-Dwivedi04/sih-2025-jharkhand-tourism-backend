/**
 * Bookings Controller
 *
 * Handles all operations for booking management.
 */

import { Request, Response } from 'express';
import {
	Booking,
	CreateBookingInput,
	CancelBookingInput,
	bookingsStore,
	generateBookingNumber
} from '../models/bookings/Booking.model';
import { homestaysStore } from '../models/homestays/Homestay.model';
import { guidesStore } from '../models/guides/Guide.model';
import {
	sendSuccess,
	sendError,
	getPaginationMeta,
	parsePaginationParams,
	generateId
} from '../utils/response.utils';

/**
 * Calculates the number of nights between two dates.
 */
function calculateNights(checkIn: Date, checkOut: Date): number {
	const diffTime = checkOut.getTime() - checkIn.getTime();
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gets the listing title based on type and ID.
 */
function getListingTitle(listingType: string, listingId: string): string | undefined {
	if (listingType === 'homestay') {
		const homestay = homestaysStore.find(h => h._id === listingId);
		return homestay?.title;
	} else if (listingType === 'guide') {
		const guide = guidesStore.find(g => g._id === listingId);
		return guide?.name;
	}
	return undefined;
}

/**
 * Checks if dates conflict with existing bookings.
 */
function hasDateConflict(
	listingId: string,
	checkIn: Date,
	checkOut: Date,
	excludeBookingId?: string
): Booking | undefined {
	return bookingsStore.find(b =>
		b.listingId === listingId &&
		b._id !== excludeBookingId &&
		b.status !== 'cancelled' &&
		checkIn < b.checkOut &&
		checkOut > b.checkIn
	);
}

/**
 * GET /api/bookings
 *
 * Retrieves all bookings with pagination and optional filters.
 *
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - status: Filter by booking status
 */
export function getAllBookings(req: Request, res: Response): void {
	const { page, limit } = parsePaginationParams(
		req.query.page as string,
		req.query.limit as string
	);
	const status = req.query.status as string | undefined;

	// Apply filters
	let filtered = [...bookingsStore];

	if (status) {
		filtered = filtered.filter(b => b.status === status);
	}

	// Sort by creation date (newest first)
	filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	// Paginate results
	const startIndex = (page - 1) * limit;
	const paginatedBookings = filtered.slice(startIndex, startIndex + limit);

	sendSuccess(res, {
		bookings: paginatedBookings,
		pagination: getPaginationMeta(page, limit, filtered.length)
	});
}

/**
 * GET /api/bookings/:id
 *
 * Retrieves a single booking by ID.
 */
export function getBookingById(req: Request, res: Response): void {
	const { id } = req.params;
	const booking = bookingsStore.find(b => b._id === id);

	if (!booking) {
		sendError(res, 'Booking not found', 404);
		return;
	}

	sendSuccess(res, booking);
}

/**
 * POST /api/bookings
 *
 * Creates a new booking.
 *
 * Request body: CreateBookingInput
 */
export function createBooking(req: Request, res: Response): void {
	const input: CreateBookingInput = req.body;

	// Basic validation
	const errors = [];
	if (!input.listingType || !['homestay', 'guide'].includes(input.listingType)) {
		errors.push({ field: 'listingType', message: 'Listing type must be "homestay" or "guide"' });
	}
	if (!input.listingId) {
		errors.push({ field: 'listingId', message: 'Listing ID is required' });
	}
	if (!input.checkIn) {
		errors.push({ field: 'checkIn', message: 'Check-in date is required' });
	}
	if (!input.checkOut) {
		errors.push({ field: 'checkOut', message: 'Check-out date is required' });
	}
	if (!input.guests?.adults || input.guests.adults < 1) {
		errors.push({ field: 'guests.adults', message: 'At least 1 adult guest is required' });
	}
	if (!input.guestDetails?.name) {
		errors.push({ field: 'guestDetails.name', message: 'Guest name is required' });
	}
	if (!input.guestDetails?.email) {
		errors.push({ field: 'guestDetails.email', message: 'Guest email is required' });
	}

	if (errors.length > 0) {
		sendError(res, 'Validation failed', 400, errors);
		return;
	}

	const checkInDate = new Date(input.checkIn);
	const checkOutDate = new Date(input.checkOut);
	const now = new Date();

	// Validate dates
	if (checkInDate <= now) {
		sendError(res, 'Validation failed', 400, [
			{ field: 'checkIn', message: 'Check-in date must be in the future' }
		]);
		return;
	}

	if (checkOutDate <= checkInDate) {
		sendError(res, 'Validation failed', 400, [
			{ field: 'checkOut', message: 'Check-out date must be after check-in date' }
		]);
		return;
	}

	// Check for date conflicts
	const conflictingBooking = hasDateConflict(input.listingId, checkInDate, checkOutDate);
	if (conflictingBooking) {
		res.status(409).json({
			success: false,
			message: 'The selected dates are not available',
			details: {
				requestedCheckIn: input.checkIn,
				requestedCheckOut: input.checkOut,
				conflictingBooking: {
					id: conflictingBooking._id,
					checkIn: conflictingBooking.checkIn.toISOString().split('T')[0],
					checkOut: conflictingBooking.checkOut.toISOString().split('T')[0]
				}
			}
		});
		return;
	}

	const nights = calculateNights(checkInDate, checkOutDate);
	const listingTitle = getListingTitle(input.listingType, input.listingId);

	const newBooking: Booking = {
		_id: generateId(),
		bookingNumber: generateBookingNumber(),
		listingType: input.listingType,
		listingId: input.listingId,
		listingTitle,
		checkIn: checkInDate,
		checkOut: checkOutDate,
		nights,
		guests: {
			...input.guests,
			total: input.guests.adults + (input.guests.children || 0)
		},
		guestDetails: input.guestDetails,
		specialRequests: input.specialRequests,
		pricing: input.pricing,
		status: 'pending',
		paymentStatus: 'pending',
		createdAt: now,
		updatedAt: now
	};

	bookingsStore.push(newBooking);
	sendSuccess(res, newBooking, 201, 'Booking created successfully');
}

/**
 * PUT /api/bookings/:id/cancel
 *
 * Cancels an existing booking.
 *
 * Request body: CancelBookingInput
 */
export function cancelBooking(req: Request, res: Response): void {
	const { id } = req.params;
	const input: CancelBookingInput = req.body;

	const index = bookingsStore.findIndex(b => b._id === id);

	if (index === -1) {
		sendError(res, 'Booking not found', 404);
		return;
	}

	const booking = bookingsStore[index];

	if (booking.status === 'cancelled') {
		sendError(res, 'This booking is already cancelled', 400);
		return;
	}

	if (booking.status === 'completed') {
		sendError(res, 'Cannot cancel a completed booking', 400);
		return;
	}

	const now = new Date();
	const cancelledBooking: Booking = {
		...booking,
		status: 'cancelled',
		cancellationReason: input.reason,
		cancelledAt: now,
		updatedAt: now
	};

	bookingsStore[index] = cancelledBooking;

	sendSuccess(res, {
		_id: cancelledBooking._id,
		status: cancelledBooking.status,
		cancellationReason: cancelledBooking.cancellationReason,
		cancelledAt: cancelledBooking.cancelledAt,
		refundAmount: cancelledBooking.pricing.total,
		refundStatus: 'pending'
	}, 200, 'Booking cancelled successfully');
}
