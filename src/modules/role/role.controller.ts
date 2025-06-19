import { Response, Request, RequestHandler } from 'express';
import AsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import { HttpCode } from '../../utils/httpCode';
import roleService from './role.service';

// @desc    Get All
// @route   GET /api/reports
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page, pageSize } = req?.query;
    const result = await roleService.getAll(
        Number(page || DEFAULT_CURRENT_PAGE),
        Number(pageSize || DEFAULT_PAGE_SIZE),
    );
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Get By Id
// @route   GET /api/reports/:id
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await roleService.getById(new Types.ObjectId(id));
    res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});


export default {
    getAll,
    getById
};
