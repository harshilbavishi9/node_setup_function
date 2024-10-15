import logger from './winston';
import { errorCodes } from './errorCodes';
import { resMessages } from './resMessages';
import { handleError } from './errorHandler';
import { User } from '../entities/userEntity';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { dataSource } from '../config/dbConfig';
import { NextFunction, Request, Response } from 'express';
import { accessTokenSecret, jwtExpiresIn } from '../../cred.json';

declare module 'express' {
  interface Request {
    user?: JwtPayload | null;
    client_id?: string;
    tenant_id?: string;
  }
}

export const encrypt = (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, accessTokenSecret, { expiresIn: jwtExpiresIn }, (err: Error | null, token: string | undefined) => {
      if (err) {
        return reject(err);
      }
      return resolve(token || '');
    });
  });
};

export const decrypt = (token: string): Promise<JwtPayload | string> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, accessTokenSecret, (err: jwt.VerifyErrors | null, payload: any) => {
      if (err) {
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return reject(message);
      }
      return resolve(payload as JwtPayload);
    });
  });
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    token = token?.startsWith('Bearer ') ? token.slice(7) : token;

    if (!token) {
      return handleError(res, resMessages.AUTHORIZATION_TOKEN_MISSING, errorCodes.UNAUTHORIZED_ACCESS);
    }

    const decoded = await decrypt(token);

    if (typeof decoded === 'string') {
      return handleError(res, decoded, errorCodes.UNAUTHORIZED_ACCESS);
    }

    req.user = decoded;

    const id = decoded?.payload?.id;
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return handleError(res, resMessages.UNAUTHORIZED_ACCESS, errorCodes.UNAUTHORIZED_ACCESS);
    }

    next();
  } catch (error) {
    logger.error(error);
    return handleError(res, resMessages.UNAUTHORIZED_ACCESS, errorCodes.SERVER_ERROR);
  }
};
