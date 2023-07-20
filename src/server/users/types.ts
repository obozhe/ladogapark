import { User } from '@prisma/client';

export type UserDTO = Omit<User, 'password' | 'salt'>;

export type UserCreate = Omit<User, 'createdAt' | 'updatedAt' | 'id'>;
