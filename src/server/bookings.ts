import dayjs from 'dayjs';
import shortid from 'shortid';
import prisma from 'core/prisma';
import { Unit } from '.prisma/client';

export const createBooking = async (total: number, start: dayjs.Dayjs, end: dayjs.Dayjs, entryId: string) => {
  const mockData = {
    name: 'buba',
    phone: '+79998887766',
    email: 'buba@buba.bu',
  };

  const client = await prisma.client.upsert({
    where: { phone: mockData.phone },
    create: { ...mockData },
    update: { ...mockData },
  });

  // пу пу пу проверяю и нахожу свободный юнит
  const unit = (await prisma.unit.findFirst({ where: { entryId } })) as Unit;

  return await prisma.booking.create({
    data: {
      total,
      number: shortid.generate().toUpperCase(),
      start: start.toDate(),
      end: end.toDate(),
      clientId: client.id,
      unitId: unit.id,
    },
  });
};

const updatePaymentToken = (bookingId: string, token: string) => {
  return prisma.booking.update({ where: { id: bookingId }, data: { token } });
};
