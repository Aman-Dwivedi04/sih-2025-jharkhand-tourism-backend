/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Provides middleware for protecting routes based on user roles and permissions.
 */

import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';
import { UserRole } from '../models/users/User.model';

/**
 * Permission definitions by role.
 *
 * Each role has a list of permissions in the format: 'resource:action'
 * The '*' permission grants access to all resources and actions.
 */
const rolePermissions: Record<UserRole, string[]> = {
	admin: ['*'], // Full access to everything

	host: [
		'homestay:create',
		'homestay:read',
		'homestay:update',
		'homestay:delete',
		'booking:read',
		'booking:update',
		'profile:read',
		'profile:update'
	],

	guide: [
		'guide:read',
		'guide:update',
		'booking:read',
		'profile:read',
		'profile:update'
	],

	customer: [
		'homestay:read',
		'guide:read',
		'product:read',
		'booking:create',
		'booking:read',
		'booking:cancel',
		'search:read',
		'profile:read',
		'profile:update'
	]
};

/**
 * Checks if a role has a specific permission.
 *
 * @param role - User role to check
 * @param permission - Permission string (e.g., 'homestay:create')
 * @returns True if role has the permission
 */
function hasPermission(role: UserRole, permission: string): boolean {
	const permissions = rolePermissions[role];

	if (!permissions) {
		return false;
	}

	// Admin has all permissions
	if (permissions.includes('*')) {
		return true;
	}

	return permissions.includes(permission);
}

/**
 * Middleware factory that requires specific permission(s).
 *
 * Use this to protect routes that require specific capabilities.
 *
 * @param permissions - One or more permissions required (all must be met)
 * @returns Express middleware function
 *
 * @example
 * router.post('/', authenticate, requirePermission('homestay:create'), createHomestay);
 *
 * @example
 * router.delete('/:id', authenticate, requirePermission('homestay:delete', 'admin:delete'), deleteHomestay);
 */
export function requirePermission(...permissions: string[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			sendError(res, 'Authentication required', 401);
			return;
		}

		const userRole = req.user.role as UserRole;

		// Check if user has all required permissions
		const hasAllPermissions = permissions.every((p) =>
			hasPermission(userRole, p)
		);

		if (!hasAllPermissions) {
			sendError(
				res,
				'Insufficient permissions',
				403,
				[{ field: 'role', message: `Role '${userRole}' lacks required permissions` }]
			);
			return;
		}

		next();
	};
}

/**
 * Middleware factory that requires specific role(s).
 *
 * Use this for simpler role-based checks.
 *
 * @param roles - One or more roles that are allowed (any one grants access)
 * @returns Express middleware function
 *
 * @example
 * router.get('/admin', authenticate, requireRole('admin'), getAdminDashboard);
 *
 * @example
 * router.post('/', authenticate, requireRole('admin', 'host'), createListing);
 */
export function requireRole(...roles: UserRole[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			sendError(res, 'Authentication required', 401);
			return;
		}

		const userRole = req.user.role as UserRole;

		if (!roles.includes(userRole)) {
			sendError(
				res,
				'Access denied',
				403,
				[{ field: 'role', message: `Role '${userRole}' is not authorized for this action` }]
			);
			return;
		}

		next();
	};
}

/**
 * Middleware that checks if user owns the resource.
 *
 * This is a factory that creates middleware for ownership checks.
 *
 * @param getUserIdFromResource - Function to extract owner ID from request
 * @returns Express middleware function
 *
 * @example
 * router.put('/:id',
 *   authenticate,
 *   requireOwnership(async (req) => {
 *     const booking = await BookingModel.findById(req.params.id);
 *     return booking?.userId?.toString();
 *   }),
 *   updateBooking
 * );
 */
export function requireOwnership(
	getUserIdFromResource: (req: Request) => Promise<string | undefined>
) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (!req.user) {
			sendError(res, 'Authentication required', 401);
			return;
		}

		const userRole = req.user.role as UserRole;

		// Admins can access any resource
		if (userRole === 'admin') {
			next();
			return;
		}

		try {
			const resourceOwnerId = await getUserIdFromResource(req);

			if (!resourceOwnerId) {
				sendError(res, 'Resource not found', 404);
				return;
			}

			if (resourceOwnerId !== req.user.userId) {
				sendError(res, 'Access denied - not resource owner', 403);
				return;
			}

			next();
		} catch (error) {
			console.error('Ownership check error:', error);
			sendError(res, 'Access check failed', 500);
		}
	};
}

/**
 * Gets the list of permissions for a given role.
 *
 * @param role - User role
 * @returns Array of permission strings
 */
export function getPermissionsForRole(role: UserRole): string[] {
	return rolePermissions[role] || [];
}

/**
 * Checks if a role is valid.
 *
 * @param role - Role string to check
 * @returns True if valid role
 */
export function isValidRole(role: string): role is UserRole {
	return ['admin', 'host', 'guide', 'customer'].includes(role);
}
