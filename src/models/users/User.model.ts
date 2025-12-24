/**
 * User Model
 *
 * Defines the User entity for authentication and authorization.
 * Passwords are hashed using bcrypt before storage.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Available user roles.
 */
export type UserRole = 'admin' | 'host' | 'guide' | 'customer';

/**
 * User interface for type checking.
 */
export interface IUser {
	email: string;
	password: string;
	name: string;
	role: UserRole;
	isActive: boolean;
	lastLogin?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * User document interface (extends Mongoose Document).
 */
export interface IUserDocument extends IUser, Document {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User model interface with static methods.
 */
export interface IUserModel extends Model<IUserDocument> {
	findByEmail(email: string): Promise<IUserDocument | null>;
}

/**
 * User schema definition.
 */
const userSchema = new Schema<IUserDocument>(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters'],
			select: false // Don't include password in queries by default
		},
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			maxlength: 100
		},
		role: {
			type: String,
			enum: ['admin', 'host', 'guide', 'customer'],
			default: 'customer'
		},
		isActive: {
			type: Boolean,
			default: true
		},
		lastLogin: {
			type: Date,
			required: false
		}
	},
	{
		timestamps: true,
		collection: 'users'
	}
);

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

/**
 * Hash password before saving.
 */
userSchema.pre('save', async function () {
	// Only hash if password is modified (or new)
	if (!this.isModified('password')) {
		return;
	}

	const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
	const salt = await bcrypt.genSalt(saltRounds);
	this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare password method for authentication.
 *
 * @param candidatePassword - Password to compare
 * @returns True if passwords match
 */
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static method to find user by email (includes password field).
 *
 * @param email - Email to search for
 * @returns User document or null
 */
userSchema.statics.findByEmail = function (
	email: string
): Promise<IUserDocument | null> {
	return this.findOne({ email }).select('+password');
};

/**
 * User model.
 */
export const UserModel: IUserModel = mongoose.model<IUserDocument, IUserModel>(
	'User',
	userSchema
);

/**
 * Input type for creating a user.
 */
export interface CreateUserInput {
	email: string;
	password: string;
	name: string;
	role?: UserRole;
}

/**
 * Safe user response (without password).
 */
export interface UserResponse {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	isActive: boolean;
	createdAt: Date;
}

/**
 * Converts a user document to a safe response object.
 *
 * @param user - User document
 * @returns User response without sensitive data
 */
export function toUserResponse(user: IUserDocument): UserResponse {
	return {
		id: user._id.toString(),
		email: user.email,
		name: user.name,
		role: user.role,
		isActive: user.isActive,
		createdAt: user.createdAt
	};
}
