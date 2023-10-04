import mongoose, { Document, Model, Schema } from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

interface ICategory extends Document {
  name: string;
  numBlog: number;
  status: boolean;
  slug: string;
  avatar: string;
}

let categorySchema: Schema<ICategory>;

categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    numBlog: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      slug: "name",
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true, // Thêm thời gian tạo và cập nhật tự động
  }
);

categorySchema.pre("save", async function (next) {
  this.slug = this.name.split(" ").join("-");
  next();
});

const Category: Model<ICategory> = mongoose.model("Category", categorySchema);

export default Category;
