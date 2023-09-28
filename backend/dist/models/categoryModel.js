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
let categorySchema;
categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    numBlog: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    removed: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        slug: "name"
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true // Thêm thời gian tạo và cập nhật tự động
});
categorySchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.slug = this.name.split(" ").join("-");
        next();
    });
});
const Category = mongoose_1.default.model('Category', categorySchema);
exports.default = Category;
