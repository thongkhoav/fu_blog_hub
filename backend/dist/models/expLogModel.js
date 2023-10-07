"use strict";
// import mongoose, { Document, Model, Schema } from 'mongoose';
// interface IExpLog extends Document {
//     userId: Schema.Types.ObjectId;
//     exp: number;
//     description: string;
//     type: string;
//     point: number;
//     received: boolean;
//     receivedAt: Date;
// }
// let expLogSchema: Schema<IExpLog>;
// expLogSchema = new mongoose.Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     },
//     exp: {
//         type: Number,
//         default: 0
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     type: {
//         type: String,
//         enum: ['blog', 'comment', 'like', 'other', 'report'],
//     },
//     received: {
//         type: Boolean,
//         default: false
//     },
//     receivedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true
// })
// const ExpLog: Model<IExpLog> = mongoose.model('ExpLog', expLogSchema);
// module.exports = ExpLog
