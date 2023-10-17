import prisma from 'core/prisma';

export const getClientById = (clientId: string) => {
  return prisma.client.findUnique({ where: { id: clientId } });
};
