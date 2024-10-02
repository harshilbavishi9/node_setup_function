import { Response } from 'express';
import { errorCodes } from './errorCodes';

export const handleError = (res: Response, message: string, statusCode: number) => {
  return res.status(statusCode).json({ message });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSuccess = (res: Response, data: any, message: string = 'Success', statusCode: number = errorCodes.SUCCESS) => {
  return res.status(statusCode).json({ message, data });
};
