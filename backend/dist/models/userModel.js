"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let userSchema;
userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please fill your name'],
    },
    email: {
        type: String,
        required: [true, 'Please fill your email'],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
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
            validator: function (el) {
                // "this" works only on create and save
                return el === this.password;
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
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check the password if it is modified
        if (!this.isModified('password')) {
            return next();
        }
        // Hashing the password
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        // Delete passwordConfirm field
        this.passwordConfirm = '';
        next();
    });
});
// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = function (typedPassword, originalPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(typedPassword, originalPassword);
    });
};
const User = mongoose_1.default.model('User', userSchema);
module.exports = User;
