import { NextFunction, Request, Response } from 'express';
import { errorCodes } from '../utils/errorCodes';
import { handleError, handleSuccess } from '../utils/errorHandler';
import { appConfig } from '../config/appConfig';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  const baseUrl = appConfig.baseUrl;

  try {
    if (req.file) {
      return handleSuccess(res, { url: baseUrl + '/upload/' + req.file?.filename }, 'File uploaded successfully.');
    }
    return handleError(res, 'File not uploaded.', errorCodes.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
};

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  const baseUrl = appConfig.baseUrl;

  try {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const fileUrls = req.files.map((file: Express.Multer.File) => baseUrl + '/upload/' + file.filename);

      return handleSuccess(res, fileUrls, 'Files uploaded successfully.');
    }

    return handleError(res, 'File not uploaded.', errorCodes.BAD_REQUEST);
  } catch (error) {
    return next(error);
  }
};
