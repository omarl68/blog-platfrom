import { Router } from 'express';
import Authorization from '../../core/middleware/auth';
import AuthorizeRole from '../../core/middleware/authorizeRole';
import { RolesEnum } from '../../constants/constants';
import CommentController from './comment.controller';

const router: Router = Router();

// Get all top-level comments of an article
router
  .route('/articles/:articleId/comments')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.ADMIN,
      RolesEnum.EDITOR,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    CommentController.getAll,
  )
  .post(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.ADMIN,
      RolesEnum.EDITOR,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    CommentController.create,
  );

// Get replies to a specific comment in an article
router.get(
  '/articles/:articleId/comments/:parentId/replies',
  Authorization.Authenticated,
  AuthorizeRole.AuthorizeRole([
    RolesEnum.ADMIN,
    RolesEnum.EDITOR,
    RolesEnum.WRITER,
    RolesEnum.READER,
  ]),
  CommentController.getAllReplies,
);

// Get total comment count for an article
router.get(
  '/articles/:articleId/comments/count',
  Authorization.Authenticated,
  AuthorizeRole.AuthorizeRole([
    RolesEnum.ADMIN,
    RolesEnum.EDITOR,
    RolesEnum.WRITER,
    RolesEnum.READER,
  ]),
  CommentController.count,
);

// Get a comment by ID
router
  .route('/comments/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.ADMIN,
      RolesEnum.EDITOR,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    CommentController.getById,
  )
  .put(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.ADMIN,
      RolesEnum.EDITOR,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    CommentController.edit,
  )
  .delete(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([
      RolesEnum.ADMIN,
      RolesEnum.EDITOR,
      RolesEnum.WRITER,
      RolesEnum.READER,
    ]),
    CommentController.remove,
  );

export default router;
