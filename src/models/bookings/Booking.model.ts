/**
 * Booking Model
 *
 * Defines the Booking entity structure and provides in-memory storage.
 * Bookings represent reservations for homestays or guide services.
 */

/**
 * Type of listing being booked.
 */
export type ListingType = 'homestay' | 'guide';

/**
 * Booking status lifecycle.
 * - pending: Awaiting confirmation
 * - confirmed: Booking confirmed
 * - cancelled: Booking cancelled
 * - completed: Stay/service completed
 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/**
 * Payment status for the booking.
 */
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed';

/**
 * Guest count breakdown.
 */
export interface GuestCount {
	adults: number;
	children?: number;
	total?: number;
}

/**
 * Guest contact details.
 */
export interface GuestDetails {
	name: string;
	email: string;
	phone: string;
}

/**
 * Booking pricing breakdown.
 */
export interface BookingPricing {
	basePrice: number;
	cleaningFee?: number;
	serviceFee?: number;
	taxes?: number;
	total: number;
}

/**
 * Complete Booking entity interface.
 */
export interface Booking {
	_id: string;
	bookingNumber: string;
	listingType: ListingType;
	listingId: string;
	listingTitle?: string;
	checkIn: Date;
	checkOut: Date;
	nights?: number;
	guests: GuestCount;
	guestDetails: GuestDetails;
	specialRequests?: string;
	pricing: BookingPricing;
	status: BookingStatus;
	paymentStatus: PaymentStatus;
	cancellationReason?: string;
	cancelledAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Input type for creating a new booking.
 * Excludes auto-generated fields.
 */
export type CreateBookingInput = {
	listingType: ListingType;
	listingId: string;
	checkIn: string;
	checkOut: string;
	guests: GuestCount;
	guestDetails: GuestDetails;
	specialRequests?: string;
	pricing: BookingPricing;
};

/**
 * Input type for cancelling a booking.
 */
export interface CancelBookingInput {
	reason?: string;
}

/**
 * In-memory storage for bookings.
 * In production, this would be replaced by a database.
 */
export const bookingsStore: Booking[] = [];

/**
 * Counter for generating booking numbers.
 */
let bookingCounter = 1000;

/**
 * Generates a unique booking number.
 *
 * @returns Formatted booking number (e.g., "JY-2025-001234")
 */
export function generateBookingNumber(): string {
	bookingCounter++;
	const year = new Date().getFullYear();
	return `JY-${year}-${String(bookingCounter).padStart(6, '0')}`;
}