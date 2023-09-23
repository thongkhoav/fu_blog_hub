import mongoose, { Document, Model, Schema } from 'mongoose';

interface ILevel extends Document {
    name: string;
    description: string;
    index: number;
    removed: boolean;
    color: string;
    expRequire: number;
}

let levelSchema: Schema<ILevel>;

levelSchema = new mongoose.Schema({
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
})

const Level: Model<ILevel> = mongoose.model('Level', levelSchema);

module .exports = Level;

