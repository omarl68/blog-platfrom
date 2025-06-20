import { Schema, model, Document, Types } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
export const COMMENT_DOCUMENT_NAME = 'Comment';
export const COMMENT_COLLECTION_NAME = 'comments';

export interface IComment extends Document {
  content: string;
  article: Types.ObjectId;
  author: Types.ObjectId;
  parent?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
schema.plugin(mongoosePagination);

schema.pre(/^find/, function (next) {
  this.populate({ path: 'author' });
  next();
});
export const CommentModel = model<IComment, Pagination<IComment>>(
  COMMENT_DOCUMENT_NAME,
  schema,
  COMMENT_COLLECTION_NAME,
);
