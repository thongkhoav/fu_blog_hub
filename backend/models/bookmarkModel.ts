import mongoose, { Document, Model, Schema } from 'mongoose';

interface IBookmark extends Document {
    userId: Schema.Types.ObjectId;
    blogId: Schema.Types.ObjectId;
    removed: boolean;
}

let bookmarkSchema: Schema<IBookmark>;

bookmarkSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    },
    removed: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Bookmark: Model<IBookmark> = mongoose.model('Tag', bookmarkSchema);

// @ts-ignore
module.exports = Bookmark