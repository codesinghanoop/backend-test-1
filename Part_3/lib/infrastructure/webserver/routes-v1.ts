import { Router } from 'express';

import AuthRoutes from '../../interfaces/routes/v1/auth';
import UsersRoutes from '../../interfaces/routes/v1/users';
import BlogsRoutes from '../../interfaces/routes/v1/blogs';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/users', UsersRoutes);
router.use('/blogs', BlogsRoutes);

export default router;