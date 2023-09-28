import mongoose, { Document, Model, Schema } from 'mongoose';

interface IReport extends Document {
    reportBy: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    blogId: Schema.Types.ObjectId;
    commentId: Schema.Types.ObjectId;
    content: string;
    removed: boolean;
    resolved: boolean;
    resolvedAt: Date;
    resolvedBy: Schema.Types.ObjectId;
}

let reportSchema: Schema<IReport>;

reportSchema = new mongoose.Schema({
    reportBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
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
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    resolvedAt: {
        type: Date,
    },
    resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
})

const Report: Model<IReport> = mongoose.model('Report', reportSchema);

module.exports = Report