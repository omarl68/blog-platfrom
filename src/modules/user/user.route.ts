import express from 'express';
import multer from 'multer';
import { RolesEnum } from '../../constants/constants';
import UserController from './user.controller';
import UserValidator from './user.validator';
import Authorization from '../../core/middleware/auth';
import AuthorizeRole from '../../core/middleware/authorizeRole';
import validator from '../../core/middleware/validator';
import limiter from '../../core/middleware/limiter';
import { multerConfig } from '../../utils/multer';

const router = express.Router();

router.post('/login', validator(UserValidator.loginSchema), UserController.login);

router.post('/register', limiter, validator(UserValidator.registerSchema), UserController.register);

router.get('/logout', Authorization.Authenticated, UserController.logout);

router.get('/refresh-token', UserController.refreshToken);

router.post('/forgot-password', validator(UserValidator.forgotPasswordSchema), UserController.forgotPassword);

router.post('/mfa/setup', UserController.setupMFA);

router.post('/mfa/verify', UserController.verifyMFA);

router.post('/account/verify', UserController.verifyAccount);

router.post('/profile/complete', Authorization.Authenticated, UserController.completeProfile);

router.put('/reset-password/', validator(UserValidator.resetPasswordSchema), UserController.resetPassword);

router.get('/profile', Authorization.Authenticated, UserController.getProfile);

router.put('/profile-update', Authorization.Authenticated, validator(UserValidator.updateProfile), UserController.updateProfile);

router.put('/profile-password-update', Authorization.Authenticated, validator(UserValidator.updateProfilePassword), UserController.updateUserPassword);

router.post('/avatar-upload', Authorization.Authenticated, multer(multerConfig).single('file'), UserController.avatarUpload);

router.route('/admin/users')
  .get(Authorization.Authenticated, AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN]), UserController.getAllUsers)
  .post(Authorization.Authenticated, AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN]), UserController.createUser);

router.route('/admin/users/:id')
  .get(Authorization.Authenticated, AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN]), UserController.getUserById)
  .put(Authorization.Authenticated, AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN]), UserController.updateUser)
  .delete(Authorization.Authenticated, AuthorizeRole.AuthorizeRole([RolesEnum.ADMIN]), UserController.deleteUser);

export default router;
