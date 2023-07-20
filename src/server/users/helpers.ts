import { User } from '@prisma/client';
import { UserDTO } from './types';

export const userDocToDto = (user: User): UserDTO => ({
  id: user.id,
  name: user.name,
  login: user.login,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
