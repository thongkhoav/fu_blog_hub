"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const URLSlug = require("mongoose-slug-generator");
mongoose_1.default.plugin(URLSlug);
var BlogState;
(function (BlogState) {
    BlogState["PUBLIC"] = "public";
    BlogState["PRIVATE"] = "private";
    BlogState["REMOVED"] = "removed";
    BlogState["WAITING"] = "waiting";
    BlogState["DRAFT"] = "draft";
    BlogState["BANNED"] = "banned";
    BlogState["REJECTED"] = "rejected";
})(BlogState || (BlogState = {}));
let blogSchema;
blogSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    blogSeriesId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BlogSeries",
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        slug: ["title", "_id"],
    },
    contentRaw: {
        type: String,
        required: true,
    },
    contentHTML: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(BlogState),
        required: true,
        default: BlogState.DRAFT,
    },
    numChar: {
        type: Number,
        default: 0,
    },
    numWord: {
        type: Number,
        default: 0,
    },
    numView: {
        type: Number,
        default: 0,
    },
    numComment: {
        type: Number,
        default: 0,
    },
    numShare: {
        type: Number,
        default: 0,
    },
    numUpVote: {
        type: Number,
        default: 0,
    },
    numDownVote: {
        type: Number,
        default: 0,
    },
    hideComment: {
        type: Boolean,
        default: false,
    },
    thumbnail: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Blog = mongoose_1.default.model("Blog", blogSchema);
module.exports = Blog;
