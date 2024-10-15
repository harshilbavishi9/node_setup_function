import { encrypt } from '../utils/token';
import { generateOTP } from '../utils/otp';
import { Otp } from '../entities/otpEntity';
import { User } from '../entities/userEntity';
import { sendEmail } from '../utils/nodemailer';
import { dataSource } from '../config/dbConfig';
import { otpTemplate } from '../utils/templates';
import { errorCodes } from '../utils/errorCodes';
import { resMessages } from '../utils/resMessages';
import { redisClient } from '../config/redisConfig';
import { encryptPassword, comparePassword } from '../utils/password';

export const authService = {
  async registerUser(userData: { name: string; email: string; password: string }) {
    const userRepository = dataSource.getRepository(User);
    const otpRepository = dataSource.getRepository(Otp);

    const existingUser = await userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return { message: resMessages.USER_ALREADY_EXISTS, success: false, code: errorCodes.ALREADY_EXISTS, data: null };
    }

    const otp = await generateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
    const hashedPassword = await encryptPassword(userData.password);

    await sendEmail(otpTemplate(otp.toString(), userData.email));

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

    await redisClient.del('all_users');

    return {
      message: resMessages.USER_REGISTER_SUCCESS,
      code: errorCodes.CREATED,
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    };
  },

  async loginUser(credentials: { email: string; password: string }) {
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: credentials.email } });

    if (!user) {
      return { message: resMessages.USER_NOT_FOUND, success: false, code: errorCodes.NOT_FOUND_ERROR, data: null };
    }

    const isMatch = await comparePassword(credentials.password, user.password);
    if (!isMatch) {
      return { message: resMessages.WRONG_PASSWORD, success: false, code: errorCodes.BAD_REQUEST, data: null };
    }

    const token = await encrypt({ id: user.id, email: user.email });
    await userRepository.update(user.id, { token });

    return {
      message: resMessages.USER_LOGIN_SUCCESS,
      code: errorCodes.SUCCESS,
      success: true,
      data: {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  },
};
