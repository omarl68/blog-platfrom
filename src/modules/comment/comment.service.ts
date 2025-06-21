import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';
import { Types } from 'mongoose';
import { IComment } from './comment.model';
import CommentsRepository from './comment.repository';
import articleRepository from '../article/article.repository';

const getAll = async (
  id: Types.ObjectId,
  page: number,
  pageSize: number,
  query: object,
  parentId?: Types.ObjectId,
) => {
  const article = await articleRepository.getById(id);

  // throw error if item not found
  if (!article) {
    throw new ErrorHandler('article not found!', HttpCode.NOT_FOUND);
  }

  // create options object to filter data
  const options = {
    page: page,
    limit: pageSize,
  };

  // get docs and meta
  const { docs, ...meta } = await CommentsRepository.findAll(
    { article: id, parent: parentId ?? null },
    options,
    query,
  );

  // return data
  return { docs, meta };
};

const getById = async (id: Types.ObjectId) => {
  const comment = await CommentsRepository.findById(id);

  // throw error if item not found
  if (!comment) {
    throw new ErrorHandler('comment not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return comment;
};

const create = async (userId: Types.ObjectId, item: IComment) => {
  // set current authentificated userid to item
  item.author = userId;
  if(item.parent){
    const comment = await CommentsRepository.findById(item.parent);

    // throw error if item not found
    if (!comment) {
      throw new ErrorHandler('parent comment not found!', HttpCode.NOT_FOUND);
    }
  
  }
  // create item
  const createdComment = await CommentsRepository.create(item);

  // return data
  return createdComment;
};

const edit = async (userId: Types.ObjectId, id: Types.ObjectId, item: IComment) => {
  // create options object to filter data
  const options = {
    user: userId,
    _id: id,
  };

  // get item by options
  const comment = await CommentsRepository.findByObj(options);

  // throw error if item not found
  if (!comment) {
    throw new ErrorHandler('comment not found!', HttpCode.NOT_FOUND);
  }

  // edit item
  const updatedComment = await CommentsRepository.update(id, item);

  // return data
  return updatedComment;
};

const CommentsNumber = async (id: Types.ObjectId) => {
  const article = await articleRepository.getById(id);

  // throw error if item not found
  if (!article) {
    throw new ErrorHandler('article not found!', HttpCode.NOT_FOUND);
  }
  const comments = await CommentsRepository.count({ article: id });

  // return data
  return comments;
};

const Delete = async (id: Types.ObjectId) => {
  const comment = await CommentsRepository.findById(id);

  // throw error if item not found
  if (!comment) {
    throw new ErrorHandler('comment not found!', HttpCode.NOT_FOUND);
  }
  await CommentsRepository.delete(id);
  return comment;
};

export default {
  getAll,
  getById,
  create,
  edit,
  CommentsNumber,
  Delete,
};
