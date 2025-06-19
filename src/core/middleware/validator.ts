import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ErrorHandler } from '../utils/errorHandler';
import { HttpCode } from '../utils/httpCode';

const validator = (schema: Schema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ErrorHandler(error.details[0].message, HttpCode.BAD_REQUEST));
        }
        next();
    };
};

export default validator; 