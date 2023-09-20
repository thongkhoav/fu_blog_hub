import mongoose, { Document, Model, Schema } from 'mongoose';

interface IBlogCategory extends Document {
    blogId: Schema.Types.ObjectId;
    categoryId: Schema.Types.ObjectId;
}

let blogCategorySchema: Schema<IBlogCategory>;

blogCategorySchema =  new mongoose.Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

module.exports = BlogCategory;