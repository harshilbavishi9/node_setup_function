import { appConfig } from '../config/appConfig';
import { errorCodes } from '../utils/errorCodes';
import { errorMessages } from '../utils/errorMessages';
import { NextFunction, Request, Response } from 'express';
import { handleError, handleSuccess } from '../utils/errorHandler';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  const baseUrl = appConfig.baseUrl;

  try {
    if (req.file) {
      return handleSuccess(res, { url: baseUrl + '/upload/' + req.file?.filename }, errorMessages.IMAGE_UPLOAD_SUCCESS);
    }
    return handleError(res, errorMessages.IMAGE_NOT_FOUND, errorCodes.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
};

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  const baseUrl = appConfig.baseUrl;

  try {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const fileUrls = req.files.map((file: Express.Multer.File) => baseUrl + '/upload/' + file.filename);

      return handleSuccess(res, fileUrls, errorMessages.IMAGES_UPLOAD_SUCCESS);
    }

    return handleError(res, errorMessages.IMAGE_NOT_FOUND, errorCodes.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
};
