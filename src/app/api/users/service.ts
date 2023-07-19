import prisma from 'lib/prisma';
import { UserCreate } from './types';
import bcrypt from 'bcrypt';

class UserService {
  public async create({ login, name, password, role }: UserCreate) {
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    return await prisma.user.create({ data: { login, name, password: passwordHash, role, salt } });
  }
}

const userService = new UserService();
export default userService;
