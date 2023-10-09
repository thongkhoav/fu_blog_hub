import mongoose, { Document, Model, Schema } from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

export interface ICategory extends Document {
  name: string;
  numBlog: number;
  status: boolean;
  slug: string;
}

let categorySchema: Schema<ICategory>;

categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v.length <= 30 && v.length >= 1;
        },
      },
    },
    numBlog: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      slug: "name",
    },
  },
  {
    timestamps: true, // Thêm thời gian tạo và cập nhật tự động
  }
);

const Category: Model<ICategory> = mongoose.model("Categories", categorySchema);

module.exports = Category;
