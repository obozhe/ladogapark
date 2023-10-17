import prisma from 'core/prisma';

export const getOfferDocument = () => {
  return prisma.documents.findUnique({ where: { singleton: true } });
};
