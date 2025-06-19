import { ErrorHandler } from '../../utils/errorHandler';
import { HttpCode } from '../../utils/httpCode';
import { Types } from 'mongoose';
import RoleRepository from './role.repository';

const getAll = async (page: number, pageSize: number) => {
  // create options object to filter data
  const options = {
    page: page,
    limit: pageSize,
  };

  // get docs and meta
  const { docs, ...meta } = await RoleRepository.getAll({}, options, {});

  // return data
  return { docs, meta };
};

const getById = async (id: Types.ObjectId) => {
  const role = await RoleRepository.getById(id);

  // throw error if item not found
  if (!role) {
    throw new ErrorHandler('role not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return role;
};

const getByObj = async (obj: object) => {
  const role = await RoleRepository.getOneByQuery(obj);

  // throw error if item not found
  if (!role) {
    throw new ErrorHandler('role not found!', HttpCode.NOT_FOUND);
  }

  // return data
  return role;
};

export default {
  getAll,
  getById,
  getByObj,
};
