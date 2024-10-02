import { NextFunction, Request, Response } from 'express';
import { handleError, handleSuccess } from '../utils/errorHandler';
import { errorCodes } from '../utils/errorCodes';
import { authService } from '../services/authService';
import { errorMessages } from '../utils/errorMessages';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const registerUser = async (req: Request<object, object, RegisterRequestBody>, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const result = await authService.registerUser(userData);

    if (!result.success) {
      return handleError(res, result.message, result.code);
    }

    return handleSuccess(res, result.data, result.message, result.code);
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req: Request<object, object, LoginRequestBody>, res: Response, next: NextFunction) => {
  try {
    const credentials = req.body;
    const result = await authService.loginUser(credentials);

    if (!result.success) {
      return handleError(res, result.message, result.code);
    }

    return handleSuccess(res, result.data, result.message, result.code);
  } catch (error) {
    return next(error);
  }
};
