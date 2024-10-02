import { getRepository } from 'typeorm';
import { User } from '../entities/userEntity';
import { handleError, handleSuccess } from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { errorCodes } from '../utils/errorCodes';

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getRepository(User);

    const users: User[] = await userRepository.find();

    return handleSuccess(res, users, 'Users fetched successfully.');
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const userRepository = getRepository(User);

    const user: User | null = await userRepository.findOne({ where: { id: +id } });

    if (!user) {
      return handleError(res, 'User not found.', errorCodes.NOT_FOUND_ERROR);
    }

    return handleSuccess(res, user, 'User fetched successfully.');
  } catch (error) {
    return next(error);
  }
};
