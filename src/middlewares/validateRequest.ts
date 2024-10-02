import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { errorCodes } from '../utils/errorCodes';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map(err => err.msg)
      .join(' ');
    return res.status(errorCodes.BAD_REQUEST).json({ message: errorMessages });
  }
  next();
};
