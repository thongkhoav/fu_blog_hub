import mongoose, { Document, Model, Schema } from 'mongoose';

interface ILike extends Document {
    userId: Schema.Types.ObjectId;
    commentId: Schema.Types.ObjectId;
    removed: boolean;
    blogId: Schema.Types.ObjectId;
}

let likeSchema: Schema<ILike>;

likeSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
    },
    removed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;