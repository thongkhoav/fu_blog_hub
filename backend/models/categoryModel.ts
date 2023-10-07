import mongoose, { Document, Model, Schema } from "mongoose";

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
      unique: true,
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

const Category: Model<ICategory> = mongoose.model("Categories", categorySchema);

module.exports = Category;
