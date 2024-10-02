import { Request, Response } from 'express';
import { errorCodes } from '../utils/errorCodes';
import { errorMessages } from '../utils/errorMessages';

interface CustomError extends Error {
  status?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.status || errorCodes.SERVER_ERROR;
  return res.status(statusCode).json({
    message: err.message || errorMessages.SOMETHING_WENT_WRONG,
  });
};

export default errorMiddleware;
