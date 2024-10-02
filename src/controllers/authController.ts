import { getRepository } from 'typeorm';
import { encrypt } from '../utils/token';
import { generateOTP } from '../utils/otp';
import { Otp } from '../entities/otpEntity';
import { User } from '../entities/userEntity';
import { NextFunction, Request, Response } from 'express';
import { handleError, handleSuccess } from '../utils/errorHandler';
import { comparePassword, encryptPassword } from '../utils/password';
import { sendEmail } from '../utils/nodemailer';
import { otpTemplate } from '../utils/templates';
import { errorCodes } from '../utils/errorCodes';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const registerUser = async (req: Request<object, object, RegisterRequestBody>, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;

  try {
    const userRepository = getRepository(User);
    const otpRepository = getRepository(Otp);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return handleError(res, 'User already exists.', errorCodes.ALREADY_EXISTS);
    }

    const otp = await generateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
    const hashedPassword = await encryptPassword(password);

    const emailOptions = {
      to: email,
      subject: 'Your OTP Code',
      html: otpTemplate(otp.toString()),
    };

    await sendEmail(emailOptions);

    const user = userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    const newUser = await userRepository.save(user);

    await otpRepository.save({
      otp,
      userid: newUser,
      expire_at: otpExpiry,
    });

    return handleSuccess(
      res,
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
      'User registered successfully.',
      errorCodes.CREATED
    );
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req: Request<object, object, LoginRequestBody>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return handleError(res, 'User not found.', errorCodes.NOT_FOUND_ERROR);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return handleError(res, 'Wrong password.', errorCodes.BAD_REQUEST);
    }

    const token = await encrypt({ id: user.id, email: user.email });
    await userRepository.update(user.id, { token });

    return handleSuccess(
      res,
      {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      'User logged in successfully.'
    );
  } catch (error) {
    return next(error);
  }
};
