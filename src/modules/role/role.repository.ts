import { Types } from 'mongoose';
import { PaginationModel } from 'mongoose-paginate-ts';
import IRole, { Role } from './role.model';
import APIFeatures from '../../utils/apiFeatures';

const getAll = async (condition: object, paging: pagingObj, query: object) => {
    let findAllQuery = Role.find({ ...condition });

    const features = new APIFeatures(findAllQuery, query)
        .filter()
        .sort()
        .limitFields()

    const options = {
        query: features.query,
        limit: paging.limit ? paging.limit : null,
        page: paging.page ? paging.page : null,
    };

    const res = (await Role.paginate(options)) as PaginationModel<IRole>;
    return res;
};

const getById = async (id: Types.ObjectId, select: string = '', populate: string = '') =>
    await Role.findById(id).select(select).populate(populate);

const getByQuery = async (options: object, select: string = '', populate: string = '') =>
    await Role.find(options).select(select).populate(populate);

const getOneByQuery = async (options: object, select: string = '', populate: string = '') =>
    await Role.findOne(options).select(select).populate(populate);


export default {
    getAll,
    getById,
    getByQuery,
    getOneByQuery
};
