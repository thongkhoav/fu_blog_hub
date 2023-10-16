import mongoose, { Document, Model, Schema } from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

export const BlogState = {
  PUBLIC: "public",
  REMOVED: "removed",
  WAITING: "waiting",
  DRAFT: "draft",
  REJECTED: "rejected",
};

export interface IBlog extends Document {
  userId: Schema.Types.ObjectId;
  blogSeriesId: Schema.Types.ObjectId;
  blogCateId: Schema.Types.ObjectId;
  title: string;
  description: string;
  slug: string;
  contentRaw: string;
  status: string;
  blogTagIds: Schema.Types.ObjectId[];
  numChar: number;
  numWord: number;
  numView: number;
  numComment: number;
  totalPoint: number;
  hideComment: boolean;
  thumbnail: string;
  tagIds: Array<Schema.Types.ObjectId>;
}

let blogSchema: Schema<IBlog>;

blogSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    blogSeriesId: {
      type: Schema.Types.ObjectId,
      ref: "BlogSeries",
    },
    blogCateId: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    blogTagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: ["title", "_id"],
    },
    contentRaw: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(BlogState),
      required: true,
      default: BlogState.DRAFT,
    },
    numChar: {
      type: Number,
      default: 0,
    },
    numWord: {
      type: Number,
      default: 0,
    },
    numView: {
      type: Number,
      default: 0,
    },
    numComment: {
      type: Number,
      default: 0,
    },
    totalPoint: {
      type: Number,
      default: 0,
    },
    hideComment: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;