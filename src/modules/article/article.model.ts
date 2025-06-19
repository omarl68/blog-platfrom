import { Schema, model, Document, Types } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { ArticleStatusEnum } from '../../constants/constants';

export const ARTICLE_DOCUMENT_NAME = 'Article';
export const ARTICLE_COLLECTION_NAME = 'articles';
  
export interface IArticle extends Document {
    title: string;
    content: string;
    image?: string;
    tags: string[];
    author: Types.ObjectId;
    views: number;
    likes: number;
    shares: number;
    status : ArticleStatusEnum, 
    createdAt: Date;
    updatedAt: Date;
  }

  const schema = new Schema<IArticle>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: 'https://plus.unsplash.com/premium_photo-1661265944044-bc7248ae54f9?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      tags: {
        type: [String],
        default: [],
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: Object.values(ArticleStatusEnum),
        default: ArticleStatusEnum.DRAFT,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  

schema.plugin(mongoosePagination);
schema.pre(/^find/, function (next) {
    this.populate('author');
    next()
})
export const Article = model<IArticle, Pagination<IArticle>>(
    ARTICLE_DOCUMENT_NAME,
    schema,
    ARTICLE_COLLECTION_NAME,
);
