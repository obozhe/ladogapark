import prisma from 'core/prisma';

export const getBookingById = (id: string) => {
  return prisma.booking.findUnique({
    where: { number: id },
    include: { commoditiesOrders: { include: { commodities: { include: { commodity: true } } } } },
  });
};

export const getBookingLimitations = (entryId: string) => {
  return prisma.entryBookingLimitation.findUnique({ where: { id: entryId, entryId } });
};

export const getBookingsByDate = (date: Date) => {
  return prisma.booking.findMany({ where: { createdAt: { gte: date } } });
};
