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
let banSchema;
banSchema = new mongoose_1.default.Schema({
    bannedReason: {
        type: String,
        default: null,
    },
    bannedUntil: {
        type: Date,
        default: null,
    },
    bannedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
let userSchema;
userSchema = new mongoose_1.default.Schema({
    avatar: {
        type: String,
        default: "https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png",
    },
    coverAvatar: {
        type: String,
        default: "https://www.englishclub.com/images/esl-wallpaper/1920x1200/ESL-Wallpaper-1920x1200-2.jpg",
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false,
    },
    numFollower: {
        type: Number,
        default: 0,
    },
    numFollowing: {
        type: Number,
        default: 0,
    },
    numComment: {
        type: Number,
        default: 0,
    },
    numBlog: {
        type: Number,
        default: 0,
    },
    ban: {
        type: banSchema,
        default: null,
    },
    userTitle: {
        type: String,
        default: null,
    },
    fullName: {
        type: String,
        required: [true, "Please fill your name"],
    },
    email: {
        type: String,
        required: [true, "Please fill your email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please fill your password"],
        minLength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "mentor", "student"],
        default: "student",
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    facebook: {
        type: String,
        default: null,
    },
    instagram: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
// Encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check the password if it is modified
        if (!this.isModified("password")) {
            return next();
        }
        // Hashing the password
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        next();
    });
});
// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = function (typedPassword, originalPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(typedPassword, originalPassword);
    });
};
const User = mongoose_1.default.model("User", userSchema);
module.exports = User;
