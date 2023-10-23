import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IBan extends Document {
  bannedReason: string;
  banAt: Date;
  banUntil: Date;
  isBanned: boolean;
}

let banSchema: Schema<IBan>;
banSchema = new mongoose.Schema(
  {
    isBanned: {
      type: Boolean,
      default: false,
    },
    bannedReason: {
      type: String,
      default: null,
    },
    banUntil: {
      type: Date,
      default: null,
    },
    banAt: {
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
  phone?: string;
  role: "admin" | "mentor" | "student";
  majorId?: Schema.Types.ObjectId; // mentor will have major(category)
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
  favoriteCates: Array<Schema.Types.ObjectId>;
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
    majorId: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },

    favoriteCates: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Categories",
        },
      ],
      default: [],
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
    phone: {
      type: String,
      default: null,
      validate: {
        validator: function (value: string) {
          if (value === null || value === undefined) {
            return true;
          }
          return /^0\d{9,10}$/.test(value);
        },
        message: "Phone number must start with 0 and have 10 or 11 digits.",
      },
    },
    email: {
      type: String,
      required: [true, "Please fill your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email format"],
    },
    password: {
      type: String,
      required: [false, "Please fill your password"],
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
