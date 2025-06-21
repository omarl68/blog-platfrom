import Joi from 'joi';
import JoiObjectId from '../../core/utils/joiObjectId';

export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  parent: JoiObjectId().optional()
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).optional(),
  parent: JoiObjectId().optional()
});

export default {
  createCommentSchema,
  updateCommentSchema,
};
