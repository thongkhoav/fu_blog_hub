"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URLSlug = require("mongoose-slug-generator");
mongoose_1.default.plugin(URLSlug);
let blogSchema;
blogSchema = new mongoose_1.default.Schema({
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    // blogSeriesId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'BlogSeries'
    // },
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
        unique: true,
        slug: "title"
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
        enum: ['public', 'private', 'draft'],
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
});
blogSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.slug = this.title.split(" ").join("-");
        next();
    });
});
const Blog = mongoose_1.default.model('BlogCategory', blogSchema);
module.exports = Blog;
