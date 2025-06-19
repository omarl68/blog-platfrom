import { NextFunction, Request, Response } from 'express';
import { HttpCode } from '../utils/httpCode';
import { ErrorHandler } from '../utils/errorHandler';


const notFound = (req: Request, res: Response, next: NextFunction) => {
  return next(new ErrorHandler(`Not Found - ${req?.originalUrl}`, HttpCode.NOT_FOUND));
};

export default notFound;
