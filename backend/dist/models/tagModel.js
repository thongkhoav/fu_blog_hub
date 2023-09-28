"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let tagSchema;
tagSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Kiểm tra xem giá trị không chứa khoảng trắng
                return !/\s/.test(value);
            },
            message: 'Name must not contain spaces.'
        }
    },
    numBlog: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true // Thêm thời gian tạo và cập nhật tự động
});
const Tag = mongoose_1.default.model('Tag', tagSchema);
module.exports = Tag;
