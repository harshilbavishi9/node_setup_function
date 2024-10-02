import { handleError, handleSuccess } from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { errorCodes } from '../utils/errorCodes';
import { userService } from '../services/userService';

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();

    return handleSuccess(res, users, 'Users fetched successfully.');
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(+id);

    if (!user) {
      return handleError(res, 'User not found.', errorCodes.NOT_FOUND_ERROR);
    }

    return handleSuccess(res, user, 'User fetched successfully.');
  } catch (error) {
    return next(error);
  }
};
