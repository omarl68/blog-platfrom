import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import expressAsyncHandler from 'express-async-handler';
import { HttpCode } from '../utils/httpCode';

import { Types } from 'mongoose';
import { TokenEnum } from '../../constants/constants';
import JwtHelper from '../utils/jwtHelper';
import userRepository from '../../modules/user/user.repository';

const Authenticated = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req?.headers?.authorization;
  const token = authToken && authToken.split(' ')[1];
  if (!token) {
    return next(new ErrorHandler('Login first to access this resource.', HttpCode.UNAUTHORIZED));
  }

  const decoded = JwtHelper.ExtractToken(token, TokenEnum.access);
  if (!decoded) {
    return next(new ErrorHandler('Invalid Token!', HttpCode.UNAUTHORIZED));
  }

  req.user = await userRepository.getById(new Types.ObjectId(decoded?.id),'','role');
  next();
});

export default { Authenticated };
