import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITag extends Document {
    name: string;
    numBlog: number;
}

let tagSchema: Schema<ITag>;

tagSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(value: string) {
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

const Tag: Model<ITag> = mongoose.model('Tag', tagSchema);

module.exports = Tag;