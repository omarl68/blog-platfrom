import Joi from 'joi';
import JoiObjectId from '../../core/utils/joiObjectId';
import { ArticleStatusEnum } from '../../constants/constants';

export const createArticleSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  content: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
  status: Joi.string()
    .valid(...Object.values(ArticleStatusEnum))
    .default(ArticleStatusEnum.DRAFT),
});

export const updateArticleSchema = Joi.object({
  title: Joi.string().min(2).max(255).optional(),
  content: Joi.string().min(10).optional(),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
  status: Joi.string()
    .valid(...Object.values(ArticleStatusEnum))
    .optional(),
});

export default {
  createArticleSchema,
  updateArticleSchema,
};
