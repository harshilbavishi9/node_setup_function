import { Request, Response } from 'express';
import { errorCodes } from '../utils/errorCodes';

interface CustomError extends Error {
  status?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.status || errorCodes.SERVER_ERROR;
  return res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
  });
};

export default errorMiddleware;
