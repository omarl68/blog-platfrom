import { Router } from 'express';
import userRoutes from '../modules/user/user.route';
import roleRoutes from '../modules/role/role.route';


const router = Router();

router.use('/', userRoutes);
router.use('/',roleRoutes)


export default router; 