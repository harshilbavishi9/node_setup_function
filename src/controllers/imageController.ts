import { baseUrl } from '../../cred.json';
import { errorCodes } from '../utils/errorCodes';
import { resMessages } from '../utils/resMessages';
import { NextFunction, Request, Response } from 'express';
import { handleError, handleSuccess } from '../utils/errorHandler';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      return handleSuccess(res, { url: baseUrl + '/upload/' + req.file?.filename }, resMessages.IMAGE_UPLOAD_SUCCESS);
    }
    return handleError(res, resMessages.IMAGE_NOT_FOUND, errorCodes.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
};

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const fileUrls = req.files.map((file: Express.Multer.File) => baseUrl + '/upload/' + file.filename);

      return handleSuccess(res, fileUrls, resMessages.IMAGES_UPLOAD_SUCCESS);
    }

    return handleError(res, resMessages.IMAGE_NOT_FOUND, errorCodes.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
};
