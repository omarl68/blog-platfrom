import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import { HttpCode } from '../utils/httpCode';

const AuthorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req?.user?.role?.code)) {
      return next(
        new ErrorHandler(
          `Role (${req?.user?.role?.code}) is not allowed to acccess this resource`,
          HttpCode.FORBIDDEN,
        ),
      );
    }

    next();
  };
};

export default { AuthorizeRole };
