import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/userEntity';
import { errorCodes } from './errorCodes';
import { errorMessages } from './errorMessages';
import { appConfig } from '../config/appConfig';
import { dataSource } from '../config/dbConfig';

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
      return res.status(errorCodes.UNAUTHORIZED_ACCESS).json({ message: errorMessages.AUTHORIZATION_TOKEN_MISSING });
    }

    const decoded = await decrypt(token);

    if (typeof decoded === 'string') {
      return res.status(errorCodes.UNAUTHORIZED_ACCESS).json({ message: decoded });
    }

    req.user = decoded;

    const id = decoded?.payload?.id;
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(errorCodes.UNAUTHORIZED_ACCESS).json({ message: errorMessages.UNAUTHORIZED_ACCESS });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(errorCodes.SERVER_ERROR).json({ message: errorMessages.UNAUTHORIZED_ACCESS });
  }
};
