import bcrypt from 'bcrypt';

export const encryptPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: Error | undefined, hash: string) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err: Error | undefined, result: boolean) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};
