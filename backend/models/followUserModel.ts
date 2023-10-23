import mongoose, { Document, Model, Schema } from "mongoose";

interface IFollow extends Document {
  userId: Schema.Types.ObjectId;
  followUserId: Schema.Types.ObjectId;
}

let followSchema: Schema<IFollow>;

followSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    followUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
