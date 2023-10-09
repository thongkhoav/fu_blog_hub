import mongoose, { Document, Model, Schema } from "mongoose";

interface IResolve extends Document {
  resolved: boolean;
  resolvedAt: Date;
  resolvedBy: Schema.Types.ObjectId;
  resolveContent?: string;
}

let resolveSchema: Schema<IResolve>;

resolveSchema = new mongoose.Schema({
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "User",
  },
  resolveContent: {
    type: String,
    default: null,
  },
});

interface IReport extends Document {
  reportBy: Schema.Types.ObjectId;
  objectId: Schema.Types.ObjectId; // userId, blogId, commentId
  type: "user" | "comment" | "blog";
  content: string;
  resolve: IResolve;
}

let reportSchema: Schema<IReport>;

reportSchema = new mongoose.Schema(
  {
    reportBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    objectId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["user", "comment", "blog"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v.length <= 1000 && v.length >= 1;
        },
      },
    },
    resolve: resolveSchema,
  },
  {
    timestamps: true,
  }
);

const Report: Model<IReport> = mongoose.model("Report", reportSchema);

module.exports = Report;
