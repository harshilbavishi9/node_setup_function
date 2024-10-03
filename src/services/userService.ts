import { User } from '../entities/userEntity';
import { dataSource } from '../config/dbConfig';

export const userService = {
  async getAllUsers() {
    const userRepository = dataSource.getRepository(User);
    return await userRepository.find({
      order: {
        id: 'DESC',
      },
    });
  },

  async getUserById(id: number) {
    const userRepository = dataSource.getRepository(User);
    return await userRepository.findOne({ where: { id } });
  },

  async updateUser(id: number, userData: Partial<User>) {
    const userRepository = dataSource.getRepository(User);
    await userRepository.update(id, userData);
    return await userRepository.findOne({ where: { id } });
  },

  async deleteUser(id: number) {
    const userRepository = dataSource.getRepository(User);
    await userRepository.delete(id);
    return { id };
  },
};
