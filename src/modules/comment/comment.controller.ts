import { Request, RequestHandler, Response } from 'express';
import AsyncHandler from 'express-async-handler';
import { HttpCode } from '../../utils/httpCode';
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constants';
import mongoose, { Types } from 'mongoose';
import commentService from './comment.service';

// @desc    Get All Comments for an article
// @route   GET /api/articles/:articleId/comments
// @access  Private
const getAll: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { articleId } = req.params;
  const { page, pageSize } = req.query;

  const result = await commentService.getAll(
    new Types.ObjectId(articleId),
    Number(page || DEFAULT_CURRENT_PAGE),
    Number(pageSize || DEFAULT_PAGE_SIZE),
    req.query,
  );

  res.status(HttpCode.OK).json({
    success: true,
    message: '',
    data: result,
  });
});

// @desc    Get Comment by ID
// @route   GET /api/comments/:id
// @access  Private
const getById: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await commentService.getById(new Types.ObjectId(id));

  res.status(HttpCode.OK).json({
    success: true,
    message: '',
    data: result,
  });
});

// @desc    Get All Comments (top-level or nested)
// @route   GET /api/articles/:articleId/comments/:parentId/replies
// @access  Private
const getAllReplies: RequestHandler = AsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { articleId, parentId } = req.params;
    const { page, pageSize } = req.query;

    const result = await commentService.getAll(
      new Types.ObjectId(articleId),
      Number(page || DEFAULT_CURRENT_PAGE),
      Number(pageSize || DEFAULT_PAGE_SIZE),
      req.query,
      parentId ? new Types.ObjectId(parentId as string) : undefined,
    );

    res.status(HttpCode.OK).json({
      success: true,
      message: '',
      data: result,
    });
  },
);

// @desc    Create Comment
// @route   POST /api/articles/:articleId/comments
// @access  Private
const create: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { articleId } = req.params;
  const payload = {
    ...req.body,
    article: new Types.ObjectId(articleId),
  };

  const result = await commentService.create(req.user.id, payload);

  res.status(HttpCode.CREATED).json({
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

// @desc    Update Comment
// @route   PUT /api/comments/:id
// @access  Private
const edit: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await commentService.edit(req.user.id, new Types.ObjectId(id), req.body);

  res.status(HttpCode.OK).json({
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

// @desc    Delete Comment
// @route   DELETE /api/comments/:id
// @access  Private
const remove: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const result = await commentService.Delete(new Types.ObjectId(id));

  res.status(HttpCode.OK).json({
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

// @desc    Count Comments by article ID
// @route   GET /api/articles/:articleId/comments/count
// @access  Private
const count: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = await commentService.CommentsNumber(new mongoose.Types.ObjectId(id));

  res.status(HttpCode.OK).json({
    success: true,
    message: '',
    data: result,
  });
});

export default {
  getAll,
  getById,
  getAllReplies,
  create,
  edit,
  remove,
  count,
};
