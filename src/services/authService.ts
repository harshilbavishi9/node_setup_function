import { getRepository } from 'typeorm';
import { encrypt } from '../utils/token';
import { generateOTP } from '../utils/otp';
import { Otp } from '../entities/otpEntity';
import { User } from '../entities/userEntity';
import { sendEmail } from '../utils/nodemailer';
import { otpTemplate } from '../utils/templates';
import { errorCodes } from '../utils/errorCodes';
import { encryptPassword, comparePassword } from '../utils/password';

export const authService = {
  async registerUser(userData: { name: string; email: string; password: string }) {
    const userRepository = getRepository(User);
    const otpRepository = getRepository(Otp);

    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return { error: 'User already exists.', code: errorCodes.ALREADY_EXISTS };
    }

    const otp = await generateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
    const hashedPassword = await encryptPassword(userData.password);

    const emailOptions = {
      to: userData.email,
      subject: 'Your OTP Code',
      html: otpTemplate(otp.toString()),
    };

    await sendEmail(emailOptions);

    const user = userRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
    });
    const newUser = await userRepository.save(user);

    await otpRepository.save({
      otp,
      userid: newUser,
      expire_at: otpExpiry,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };
  },

  async loginUser(credentials: { email: string; password: string }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email: credentials.email } });

    if (!user) {
      return { error: 'User not found.', code: errorCodes.NOT_FOUND_ERROR };
    }

    const isMatch = await comparePassword(credentials.password, user.password);
    if (!isMatch) {
      return { error: 'Wrong password.', code: errorCodes.BAD_REQUEST };
    }

    const token = await encrypt({ id: user.id, email: user.email });
    await userRepository.update(user.id, { token });

    return {
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  },
};
