import mongoose, { Document, Model, Schema } from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

export interface IBlogSeries extends Document {
  title: string;
  description: string;
  slug: string;
  userId: Schema.Types.ObjectId;
  numBlog: number;
}

let blogSeriesSchema: Schema<IBlogSeries>;

blogSeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    slug: "name",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  numBlog: {
    type: Number,
    default: 0,
  },
});

const BlogSeriesModel: Model<IBlogSeries> = mongoose.model(
  "BlogSeries",
  blogSeriesSchema
);

// @ts-ignore
module.exports = BlogSeriesModel;
