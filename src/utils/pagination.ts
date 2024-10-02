import { Request, Response, NextFunction } from 'express';
import { errorMessages } from './errorMessages';

interface PaginatedQuery {
  page?: string;
  limit?: string;
  pageNumber?: string;
  pageSize?: string;
  offset?: string;
}

export const paginationMiddleware = (req: Request<object, object, object, PaginatedQuery>, res: Response, next: NextFunction) => {
  const { page = '1', limit = '10' } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  if (isNaN(pageNumber) || pageNumber < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json({ error: errorMessages.INVALID_PAGE_OR_LIMIT });
  }

  const offset = (pageNumber - 1) * pageSize;

  req.query.pageNumber = pageNumber.toString();
  req.query.pageSize = pageSize.toString();
  req.query.offset = offset.toString();

  next();
};
