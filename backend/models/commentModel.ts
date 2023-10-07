import mongoose, { Document, Model, Schema } from "mongoose";

interface IComment extends Document {
  userId: Schema.Types.ObjectId;
  children: Schema.Types.ObjectId[];
  blogId: Schema.Types.ObjectId;
  content: string;
  status: boolean;
}

let commentSchema: Schema<IComment>;

commentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    children: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
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
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
