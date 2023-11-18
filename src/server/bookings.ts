import prisma from 'core/prisma';

export const getBookingById = (id: string) => {
  return prisma.booking.findUnique({ where: { number: id }, include: { commoditiesOrders: true } });
};
