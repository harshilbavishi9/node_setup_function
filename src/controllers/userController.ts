import { errorCodes } from '../utils/errorCodes';
import { redisClient } from '../config/redisConfig';
import { userService } from '../services/userService';
import { resMessages } from '../utils/resMessages';
import { Request, Response, NextFunction } from 'express';
import { handleError, handleSuccess } from '../utils/errorHandler';

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cachedUsers = await redisClient.get('all_users');

    if (cachedUsers) {
      return handleSuccess(res, JSON.parse(cachedUsers), resMessages.USERS_FETCH_SUCCESS);
    }

    const users = await userService.getAllUsers();

    await redisClient.setEx('all_users', 3600, JSON.stringify(users));

    return handleSuccess(res, users, resMessages.USERS_FETCH_SUCCESS);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(+id);

    if (!user) {
      return handleError(res, resMessages.USER_NOT_FOUND, errorCodes.NOT_FOUND_ERROR);
    }

    return handleSuccess(res, user, resMessages.USER_FETCH_SUCCESS);
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const updatedUser = await userService.updateUser(+id, req.body);

    await redisClient.del('all_users');

    return handleSuccess(res, updatedUser, resMessages.USER_UPDATE_SUCCESS);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedUser = await userService.deleteUser(+id);

    await redisClient.del('all_users');

    return handleSuccess(res, deletedUser, resMessages.USER_DELETE_SUCCESS);
  } catch (error) {
    return next(error);
  }
};
