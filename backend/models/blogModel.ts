import mongoose, { Document, Model, Schema } from 'mongoose';
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

export interface IBlog extends Document {
   userId: Schema.Types.ObjectId;
   blogSeriesId: Schema.Types.ObjectId;
   tags: Schema.Types.ObjectId;
   title: string;
   description: string;
   slug: string;
   contentRaw: string;
   contentHTML: string;
   status: 'public' | 'private' | 'removed' | 'waiting' | 'draft' | 'banned';
   numChar: number;
   numWord: number;
   numView: number;
   numLike: number;
   numComment: number;
   numShare: number;
   numUpVote: number;
   numDownVote: number;
   lockComment: boolean;
   hideComment: boolean;
   rankPoint: number;
   avatar: string;
}

let blogSchema: Schema<IBlog>;

blogSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    blogSeriesId: {
        type: Schema.Types.ObjectId,
        ref: 'BlogSeries'
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: ['title', '_id']
    },
    contentRaw: {
        type: String,
        required: true
    },
    contentHTML: {
        type: String,
    },
    status: {
        type: String,
        enum: ['public', 'private', 'removed', 'waiting', 'draft', 'banned'],
        required: true,
        default: 'draft'
    },
    numChar: {
        type: Number,
        default: 0
    },
    numWord: {
        type: Number,
        default: 0
    },
    numView: {
        type: Number,
        default: 0
    },
    numLike: {
        type: Number,
        default: 0
    },
    numComment: {
        type: Number,
        default: 0
    },
    numShare: {
        type: Number,
        default: 0
    },
    numUpVote: {
        type: Number,
        default: 0
    },
    numDownVote: {
        type: Number,
        default: 0
    },
    lockComment: {
        type: Boolean,
        default: false
    },
    hideComment: {
        type: Boolean,
        default: false
    },
    rankPoint: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;