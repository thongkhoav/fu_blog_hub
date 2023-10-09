import mongoose, { Document, Model, Schema } from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

interface IBlogSeries extends Document {
  name: string;
  description: string;
  slug: string;
  userId: Schema.Types.ObjectId;
  numBlog: number;
  order: number;
}

let blogSeriesSchema: Schema<IBlogSeries>;

blogSeriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
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

blogSeriesSchema.pre("save", async function (next) {
  this.slug = this.name.split(" ").join("-");
  next();
});

const BlogSeriesModel: Model<IBlogSeries> = mongoose.model(
  "BlogSeries",
  blogSeriesSchema
);

// @ts-ignore
module.exports = BlogSeriesModel;
