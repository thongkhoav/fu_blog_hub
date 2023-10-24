import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  userId: Schema.Types.ObjectId;
  children?: Schema.Types.ObjectId[];
  isParent: boolean;
  blogId: Schema.Types.ObjectId;
  content: string;
  status: boolean;
}

let commentSchema: Schema<IComment>;

commentSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    children: [{  type: Schema.Types.ObjectId, 
                  ref: "Comment" 
              }],
    isParent:{
      type: Boolean,
      default: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return v.length <= 1000 && v.length >= 1;
        },
      },
    },
    status: {
      type: Boolean,
      default: true, // over 3 report will change status to false
    },
  },
  {
    timestamps: true,
  }
);
const Comment : Model<IComment> = mongoose.model("Comment", commentSchema);

module.exports = Comment;
