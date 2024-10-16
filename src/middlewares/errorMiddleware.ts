import { Request, Response } from 'express';
import { errorCodes } from '../utils/errorCodes';
import { resMessages } from '../utils/resMessages';
import { handleError } from '../utils/errorHandler';

interface CustomError extends Error {
  status?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.status || errorCodes.SERVER_ERROR;
  return handleError(res, err.message || resMessages.SOMETHING_WENT_WRONG, statusCode);
};

export default errorMiddleware;
