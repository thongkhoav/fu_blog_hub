import mongoose, { Document, Model, Schema } from 'mongoose';

interface INotification extends Document {
   userId: Schema.Types.ObjectId;
   read: boolean;
   url: string;
}

let notificationSchema: Schema<INotification>;

notificationSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    read: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const Notification: Model<INotification> = mongoose.model('Notification', notificationSchema);

module.exports = Notification