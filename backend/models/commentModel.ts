import mongoose, { Document, Model, Schema } from 'mongoose';

interface IComment extends Document {
    userId: Schema.Types.ObjectId;
    commentId: Schema.Types.ObjectId;
    isUnlike: boolean;
    blogId: Schema.Types.ObjectId;
    content: string;
    removed: boolean;
}

let commentSchema: Schema<IComment>;

commentSchema = new mongoose.Schema({
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
    isUnlike: {
        type: Boolean,
        default: false,
    },
    content:{
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return v.length <= 1000 && v.length >= 1;
            }
        }
    },
    removed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;