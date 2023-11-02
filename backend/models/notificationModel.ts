import mongoose, { Document, Model, Schema } from "mongoose";

interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  readed: boolean;
  url: string;
  content: string;
}

let notificationSchema: Schema<INotification>;

notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    readed: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
        default: "/",
      // required: true,
    },
    content: {
      type: String,
      required: true,
      validator: function (v: string) {
        return v.length <= 150 && v.length >= 1;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;
