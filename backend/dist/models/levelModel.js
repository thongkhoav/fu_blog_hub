"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let levelSchema;
levelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    index: {
        type: Number,
        default: 0,
        required: true,
        unique: true,
    },
    removed: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: "#000000"
    },
    expRequire: {
        type: Number,
        default: 0
    }
});
const Level = mongoose_1.default.model('Level', levelSchema);
module.exports = Level;
