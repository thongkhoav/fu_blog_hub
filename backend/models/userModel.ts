import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    name: string;
    email: string;
    address?: string;
    password: string;
    passwordConfirm: string;
    role: 'admin' | 'teacher' | 'student';
    active: boolean;

    correctPassword(typedPassword: string, originalPassword: string): Promise<boolean>;
}

let userSchema: Schema<IUser>;
userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please fill your name'],
    },
    email: {
        type: String,
        required: [true, 'Please fill your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    address: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please fill your password'],
        minLength: 6,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please fill your password confirm'],
        validate: {
            validator: function (el: string) {
                // "this" works only on create and save
                return el === (this as any).password;
            },
            message: 'Your password and confirmation password are not the same',
        },
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student',
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

// Encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
userSchema.pre<IUser>('save', async function (next) {
    // Check the password if it is modified
    if (!this.isModified('password')) {
        return next();
    }

    // Hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = '';
    next();
});

// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = async function (
    typedPassword: string,
    originalPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(typedPassword, originalPassword);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

module.exports = User;