import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IBan extends Document {
  bannedReason: string;
  bannedAt: Date;
  bannedUntil: Date;
}

let banSchema: Schema<IBan>;
banSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "mentor" | "student";
  active: boolean; // account only login at 1 time
  isVerifiedEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  coverAvatar?: string;
  ban?: Schema;
  numBlog?: number;
  numComment?: number;
  numFollower?: number;
  numFollowing?: number;
  userTitle?: string;
  facebook?: string;
  instagram?: string;
  correctPassword(
    typedPassword: string,
    originalPassword: string
  ): Promise<boolean>;
}

let userSchema: Schema<IUser>;
userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default:
        "https://med.virginia.edu/diabetes-technology/wp-content/uploads/sites/265/2020/10/Blank-Avatar.png",
    },
    coverAvatar: {
      type: String,
      default:
        "https://www.englishclub.com/images/esl-wallpaper/1920x1200/ESL-Wallpaper-1920x1200-2.jpg",
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
      validate: [validator.isEmail, "Please provide a valid email"],
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
  },
  {
    timestamps: true,
  }
);

// Encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
userSchema.pre<IUser>("save", async function (next) {
  // Check the password if it is modified
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = async function (
  typedPassword: string,
  originalPassword: string
): Promise<boolean> {
  return await bcrypt.compare(typedPassword, originalPassword);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

module.exports = User;
