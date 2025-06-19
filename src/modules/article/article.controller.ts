import { Response, Request, RequestHandler } from 'express';
import AsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import { HttpCode } from '../../utils/httpCode';
import articleService from './article.service';

// @desc    Get All
// @route   GET /api/articles
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page, pageSize } = req?.query;
  const result = await articleService.getAll(
    Number(page || DEFAULT_CURRENT_PAGE),
    Number(pageSize || DEFAULT_PAGE_SIZE),
    req.query,
  );
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Get By Id
// @route   GET /api/articles/:id
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await articleService.getById(new Types.ObjectId(id));
  res.status(HttpCode.OK).json({ success: true, message: '', data: result });
});

// @desc    Create
// @route   POST /api/articles
// @access  Private
const create: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  req.body.image = req?.file?.filename;
  const result = await articleService.create(req?.user?.id, req?.body);
  res.status(HttpCode.CREATED).json({
    success: true,
    message: 'Article created successfully',
    data: result,
  });
});

// @desc    Update
// @route   PUT /api/articles/:id
// @access  Private
const edit: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  if (req.file) req.body.image = req.file.filename;
  const result = await articleService.edit(req?.user, new Types.ObjectId(id), req?.body);
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Article updated successfully',
    data: result,
  });
});

// @desc    Delete
// @route   DELETE /api/articles/:id
// @access  Private
const remove: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req?.params;
  const result = await articleService.remove(req?.user?.id, new Types.ObjectId(id));
  res.status(HttpCode.OK).json({
    success: true,
    message: 'Article deleted successfully',
    data: result,
  });
});

// @desc    Update
// @route   PUT /api/articles/:id/share
// @access  Private
const incrementShare: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req?.params;
    const result = await articleService.incrementShare(new Types.ObjectId(id));
    res.status(HttpCode.OK).json({
      success: true,
      message: 'Article updated successfully',
      data: result,
    });
  },
);
export default {
  getAll,
  getById,
  create,
  edit,
  remove,
  incrementShare,
};
