import prisma from 'core/prisma';
import _ from 'lodash';
import { userDocToDto } from './helpers';
import { UserCreate } from './types';
import bcrypt from 'bcrypt';

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users.map(userDocToDto);
};

export const createUser = async ({ login, name, password, role }: UserCreate) => {
  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);

  return await prisma.user.create({ data: { login, name, password: passwordHash, role, salt } });
};
