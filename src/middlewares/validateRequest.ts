import { errorCodes } from '../utils/errorCodes';
import { handleError } from '../utils/errorHandler';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map(err => err.msg)
      .join(' ');

    return handleError(res, errorMessages, errorCodes.BAD_REQUEST);
  }
  next();
};
