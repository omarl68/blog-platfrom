import { Router } from 'express';
import userRoutes from '../modules/user/user.route';
import roleRoutes from '../modules/role/role.route';
import articleRoutes from '../modules/article/article.route';
import commentRoutes from '../modules/comment/comment.route';

const router = Router();

router.use('/', userRoutes);
router.use('/', roleRoutes);
router.use('/', articleRoutes);
router.use('/', commentRoutes);

export default router;
