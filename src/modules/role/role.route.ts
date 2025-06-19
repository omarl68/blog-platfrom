import { Router } from 'express';
import Authorization from '../../core/middleware/auth';
import AuthorizeRole from '../../core/middleware/authorizeRole';
import { RolesEnum } from '../../constants/constants';
import ReportController from './role.controller';

const router: Router = Router();

router
  .route('/roles')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN, RolesEnum.EDITOR, RolesEnum.WRITER , RolesEnum.READER]),
    ReportController.getAll,
  )

router
  .route('/roles/:id')
  .get(
    Authorization.Authenticated,
    AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN, RolesEnum.EDITOR, RolesEnum.WRITER , RolesEnum.READER]),
    ReportController.getById,
  )

export default router;
