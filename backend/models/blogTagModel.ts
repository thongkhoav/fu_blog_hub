import mongoose, { Document, Model, Schema } from "mongoose";

interface IBlogTag extends Document {
  blogId: Schema.Types.ObjectId;
  tagId: Schema.Types.ObjectId;
}

let blogTagSchema: Schema<IBlogTag>;

blogTagSchema = new mongoose.Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    tagId: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogTag = mongoose.model("BlogTag", blogTagSchema);

module.exports = BlogTag;
