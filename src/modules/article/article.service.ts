import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';
import { Types } from 'mongoose';
import ArticleRepository from './article.repository';
import userRepository from '../user/user.repository';
import { IArticle } from './article.model';
import { RolesEnum } from '../../constants/constants';
import { IUser } from '../user/user.model';

const getAll = async (page: number, pageSize: number, query: object) => {
  // create options object to filter data
  const options = {
    page: page,
    limit: pageSize,
  };

  // get docs and meta
  const { docs, ...meta } = await ArticleRepository.getAll({}, options, query);

  // return data
  return { docs, meta };
};

const getById = async (id: Types.ObjectId) => {
  const article = await ArticleRepository.getById(id);

  // throw error if item not found
  if (!article) {
    throw new ErrorHandler('article not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return article;
};

const create = async (userId: Types.ObjectId, item: IArticle) => {
  const checkUser = await userRepository.getById(item?.author);
  if (!checkUser) throw new ErrorHandler('User not found', HttpCode.NOT_FOUND);
  // create item
  const createdArticle = await ArticleRepository.create({ ...item, createdBy: userId });

  // return data
  return createdArticle;
};

const edit = async (user: IUser, id: Types.ObjectId, item: IArticle) => {
  // get item by options
  const article = await ArticleRepository.getById(id);

  // throw error if item not found
  if (!article) {
    throw new ErrorHandler('article not found!', HttpCode.NOT_FOUND);
  }

  const isAuthor = article.author.toString() === user._id.toString();
  const isPrivileged = [RolesEnum.ADMIN, RolesEnum.EDITOR].includes(user?.role?.code as RolesEnum);

  if (!isAuthor && !isPrivileged) {
    throw new ErrorHandler('Permission denied', HttpCode.FORBIDDEN);
  }
  // edit item
  const updatedArticle = await ArticleRepository.edit(id, item);

  // return data
  return updatedArticle;
};

const remove = async (userId: Types.ObjectId, id: Types.ObjectId) => {
  // create options object to filter data
  const options = {
    user: userId,
    _id: id,
  };

  // get item by options
  const article = await ArticleRepository.getOneByQuery(options);

  // throw error if item not found
  if (!article) {
    throw new ErrorHandler('article not found!', HttpCode.NOT_FOUND);
  }

  // remove item
  await ArticleRepository.remove(id);

  // return data
  return article;
};
const incrementShare = async (id: Types.ObjectId) => {
  // get item by options
  const article = await ArticleRepository.getById(id);

  // throw error if item not found
  if (!article) {
    throw new ErrorHandler('article not found!', HttpCode.NOT_FOUND);
  }

  // edit item
  const updatedArticle = await ArticleRepository.edit(id, { shares: article.shares + 1 });

  // return data
  return updatedArticle;
};

export default {
  getAll,
  getById,
  create,
  edit,
  remove,
  incrementShare
};
