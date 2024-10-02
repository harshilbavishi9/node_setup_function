import { getRepository } from 'typeorm';
import { User } from '../entities/userEntity';

export const userService = {
  async getAllUsers() {
    const userRepository = getRepository(User);
    return await userRepository.find();
  },

  async getUserById(id: number) {
    const userRepository = getRepository(User);
    return await userRepository.findOne({ where: { id } });
  },

  async updateUser(id: number, userData: Partial<User>) {
    const userRepository = getRepository(User);
    await userRepository.update(id, userData);
    return await userRepository.findOne({ where: { id } });
  },

  async deleteUser(id: number) {
    const userRepository = getRepository(User);
    await userRepository.delete(id);
    return { id };
  },
};
