import prisma from 'core/prisma';

export const getPromoCodeById = (id: string) => {
  return prisma.promoCode.findUnique({ where: { id } });
};
