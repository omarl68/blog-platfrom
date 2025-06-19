import { Router } from 'express';
import Authorization from '../../core/middleware/auth';
import AuthorizeRole from '../../core/middleware/authorizeRole';
import validator from '../../core/middleware/validator';
import { RolesEnum } from '../../constants/constants';
import ArticleController from './article.controller';
import ArticleValidator from './article.validator';
import multer from 'multer';
import { multerConfig } from '../../utils/multer';
import { resolve } from 'path';

const router: Router = Router();

router
  .route('/articles')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.EDITOR,
      RolesEnum.ADMIN,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    ArticleController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.WRITER, RolesEnum.EDITOR, RolesEnum.ADMIN]),
    multer({ ...multerConfig, dest: resolve(__dirname, '..', '..', 'public', 'articles') }).single(
      'file',
    ),
    validator(ArticleValidator.createArticleSchema),
    ArticleController.create,
  );

router
  .route('/articles/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.EDITOR,
      RolesEnum.ADMIN,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    ArticleController.getById,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.EDITOR, RolesEnum.ADMIN, RolesEnum.WRITER]),
    multer({ ...multerConfig, dest: resolve(__dirname, '..', '..', 'public', 'articles') }).single(
      'file',
    ),
    validator(ArticleValidator.updateArticleSchema),
    ArticleController.edit,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN]),
    ArticleController.remove,
  );

router
  .route('/articles/:id/share')
  .put(
    Authorization.Authenticated,
    ArticleController.edit,
  );

export default router;
