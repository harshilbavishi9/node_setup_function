import { handleError, handleSuccess } from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { errorCodes } from '../utils/errorCodes';
import { userService } from '../services/userService';
import { errorMessages } from '../utils/errorMessages';

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();

    return handleSuccess(res, users, errorMessages.USERS_FETCH_SUCCESS);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(+id);

    if (!user) {
      return handleError(res, errorMessages.USER_NOT_FOUND, errorCodes.NOT_FOUND_ERROR);
    }

    return handleSuccess(res, user, errorMessages.USER_FETCH_SUCCESS);
  } catch (error) {
    return next(error);
  }
};
