import { Types } from 'mongoose';
import { PaginationModel } from 'mongoose-paginate-ts';
import APIFeatures from '../../utils/apiFeatures';
import { Article, IArticle } from './article.model';

const getAll = async (condition: object, paging: pagingObj, query: object) => {
    let findAllQuery = Article.find({ ...condition });

    const features = new APIFeatures(findAllQuery, query)
        .filter()
        .sort()
        .limitFields()

    const options = {
        query: features.query,
        limit: paging.limit ? paging.limit : null,
        page: paging.page ? paging.page : null,
    };

    const res = (await Article.paginate(options)) as PaginationModel<IArticle>;
    return res;
};

const getById = async (id: Types.ObjectId, select: string = '', populate: string = '') =>
    await Article.findById(id).select(select).populate(populate);

const getByQuery = async (options: object, select: string = '', populate: string = '') =>
    await Article.find(options).select(select).populate(populate);

const getOneByQuery = async (options: object, select: string = '', populate: string = '') =>
    await Article.findOne(options).select(select).populate(populate);

const create = async (item: object) => await Article.create(item);

const edit = async (id: Types.ObjectId, item: object) =>
    await Article.findByIdAndUpdate(id, item, { new: true });

const remove = async (id: Types.ObjectId) => await Article.findByIdAndDelete(id);

export default {
    getAll,
    getById,
    getByQuery,
    getOneByQuery,
    create,
    edit,
    remove,
};
