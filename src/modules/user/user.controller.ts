import { Request, Response, RequestHandler } from 'express';
import { ErrorHandler } from '../../utils/errorHandler';
import AsyncHandler from 'express-async-handler';
import {
  DAY_IN_MILLISECOND,
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
  EnvironmentEnum,
} from '../../constants/constants';
import { HttpCode } from '../../utils/httpCode';
import { Types } from 'mongoose';
import UserService from './user.service';

// @desc    Auth user & get token
// @route   POST /api/login
// @access  Public
const login: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req?.body;
  let result = await UserService.login(email.trim().toLowerCase(), password);
  if (!result.mfaRequired) {

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: false,
      secure: false,
      // process.env.NODE_ENV === EnvironmentEnum.prod,
      maxAge: Number(`${process.env.COOKIE_EXPIRES_TIME}`) * DAY_IN_MILLISECOND,
    });
    result.refreshToken = undefined;
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  } else {
    res.status(HttpCode.OK).json({ success: true, message: 'MFA required' });

  }

});

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const register: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req?.body;
    const result = await UserService.register(firstName, lastName, email.trim().toLowerCase(), password);
    // res.cookie('refreshToken', result.refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === EnvironmentEnum.prod,
    //   maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND,
    // });
    // result.refreshToken = undefined;
    res.status(HttpCode.CREATED).json({
      success: true,
      message: `Please verify your email, an otp code has been sent to ${email}`,
      data: result,
    });
  },
);
// @desc    Verify user account
// @route   POST /api/account/verify
// @access  Public
const verifyAccount: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req?.body;
    const result = await UserService.verifyAccount(email, otp);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === EnvironmentEnum.prod,
      maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND,
    });
    result.refreshToken = undefined;
    res.status(HttpCode.CREATED).json({
      success: true,
      message: `Email verified`,
      data: result,
    });
  },
);
// @desc    Complete user profile
// @route   POST /api/profile/complete
// @access  Public
const completeProfile: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const profileData = req.body;
    const completedProfile = await UserService.completeProfile(req.user, profileData);
    res.status(HttpCode.OK).json({
      message: 'Profile completed successfully',
      user: completedProfile,
    });

  },
);
// @desc    Logout user
// @route   GET /api/logout
// @access  Private
const logout: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.cookie('refreshToken', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === EnvironmentEnum.prod,
  });
  res.status(HttpCode.OK).json({ success: true, message: 'Logged out', data: null });
});

// @desc    Get new access token
// @route   GET /api/refresh-token
// @access  Private
const refreshToken: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req?.cookies;
    if (!refreshToken) {
      throw new ErrorHandler('Unauthorized!', HttpCode.UNAUTHORIZED);
    }
    const result = await UserService.refreshToken(refreshToken);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Forgot password
// @route   GET /api/forgot-password
// @access  Public
const forgotPassword: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req?.body;
    const result = await UserService.forgotPassword(email.trim().toLowerCase());
    res.status(HttpCode.OK).json({
      success: true,
      message: `Email has been sent to ${email}. Follow the instruction to reset your password.`,
      data: result,
    });
  },
);

// @desc    Reset Password
// @route   GET /api/reset-password
// @access  Public
const resetPassword: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, password, confirmPassword } = req.body;
    const result = await UserService.resetPassword(token, password, confirmPassword);
    res.status(HttpCode.OK).json({
      success: true,
      message: 'Password Successfully Updated',
      data: result,
    });
  },
);

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.getUserProfile(req?.user?.id);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Update user profile
// @route   PUT /api/profile-update
// @access  Private
const updateProfile: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.updateProfile(req?.user?.id, req.body);
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Update user profile
// @route   PUT /api/profile-password-update
// @access  Private
const updateUserPassword: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { oldPassword, password, confirmPassword } = req?.body;
    const result = await UserService.updateUserPassword(
      req?.user?.id,
      oldPassword,
      password,
      confirmPassword,
    );
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Upload  user avatar
// @route   PUT /api/avatar-upload
// @access  Private
const avatarUpload: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.avatarUpload(req?.user?.id, req?.file?.filename);
    res
      .status(HttpCode.OK)
      .json({ success: true, message: 'image uploaded successfully', data: result });
  },
);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, page, pageSize } = req?.query;
    const result = await UserService.getAllUsers(
      String(name || ''),
      Number(page || DEFAULT_CURRENT_PAGE),
      Number(pageSize || DEFAULT_PAGE_SIZE),
    );
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);



// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await UserService.getUserById(new Types.ObjectId(id));
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
  },
);

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await UserService.createUser(req?.body);
    res
      .status(HttpCode.CREATED)
      .json({ success: true, message: 'User created successfully', data: result });
  },
);

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await UserService.updateUser(new Types.ObjectId(id), req?.body);
    res
      .status(HttpCode.OK)
      .json({ success: true, message: 'User updated successfully', data: result });
  },
);

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await UserService.deleteUser(new Types.ObjectId(id));
    res
      .status(HttpCode.OK)
      .json({ success: true, message: 'User deleted successfully', data: result });
  },
);

// @desc    Setup MFA
// @route   POST /api/auth/mfa/setup
// @access  Public
const setupMFA: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const result = await UserService.setupMFA(email)
  res.status(200).json({
    message: 'MFA setup initiated',
    secret: result,
  });
});
// @desc    Verify MFA
// @route   POST /api/auth/mfa/verify
// @access  Public
const verifyMFA: RequestHandler = AsyncHandler(async (req, res): Promise<void> => {
  const { email, token } = req.body;
  const result = await UserService.verifyMFA(email, token)
  res.cookie('token', result, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.status(HttpCode.OK).json({
    success: true,
    message: '',
    data: result

  })
});


export default {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updateUserPassword,
  avatarUpload,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  setupMFA,
  verifyMFA,
  verifyAccount,
  completeProfile
};
