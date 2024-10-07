import { errorCodes } from './errorCodes';
import { handleError } from './errorHandler';
import { User } from '../entities/userEntity';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { resMessages } from './resMessages';
import { appConfig } from '../config/appConfig';
import { dataSource } from '../config/dbConfig';
import { NextFunction, Request, Response } from 'express';

const accessTokenSecret: string = appConfig.accessTokenSecret as string;
const expiresIn: string = appConfig.jwtExpiresIn as string;

declare module 'express' {
  interface Request {
    user?: JwtPayload | null;
    client_id?: string;
    tenant_id?: string;
  }
}

export const encrypt = (payload: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, accessTokenSecret, { expiresIn: expiresIn }, (err: Error | null, token: string | undefined) => {
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
    console.log(error);
    return handleError(res, resMessages.UNAUTHORIZED_ACCESS, errorCodes.SERVER_ERROR);
  }
};
