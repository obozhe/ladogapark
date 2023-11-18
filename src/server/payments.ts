import prisma from 'core/prisma';

export const getPaymentByBookingId = (bookingId: string) => {
  return prisma.payment.findMany({ where: { bookingId } });
};
