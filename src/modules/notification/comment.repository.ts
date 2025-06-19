import { Types } from 'mongoose';
import { PaginationModel } from 'mongoose-paginate-ts';
import APIFeatures from '../../utils/apiFeatures';
import { CommentModel, IComment } from './comment.model';

export default class CommentsRepository {
  public static async findById(id: Types.ObjectId): Promise<IComment | null> {
    return await CommentModel.findById(id);
  }

  public static async findByObj(obj: object): Promise<IComment | null> {
    return await CommentModel.findOne(obj);
  }
  public static async count(obj: object): Promise<Number | null> {
    return await CommentModel.count(obj);
  }
  public static async delete(commentId: Types.ObjectId) {
    return await CommentModel.findByIdAndDelete(commentId);
  }
  public static async findAll (condition: object, paging: pagingObj, query: object): Promise<PaginationModel<IComment>> {
    let findAllQuery = CommentModel.find({ ...condition });
    const features = new APIFeatures(findAllQuery, query).filter().sort().limitFields().search([]);

    const options = {
      query: features.query,
      limit: paging.limit ? paging.limit : null,
      page: paging.page ? paging.page : null,
  };

    return (await CommentModel.paginate(options)) as PaginationModel<IComment>;
  }

  public static async create(obj: object): Promise<IComment | null> {
    return await CommentModel.create(obj);
  }

  public static async update(
    commentId: Types.ObjectId,
    obj: any,
  ): Promise<IComment | null> {
    return await CommentModel.findOneAndUpdate(
      { _id: commentId },
      { $set: obj },
      { new: true },
    );
  }
}
