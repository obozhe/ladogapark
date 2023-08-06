import dayjs from 'dayjs';
import prisma from 'core/prisma';
import { CreateBookingLimitationDTO } from './types';

export const getBookingLimitationsByEntryId = (id: string) => {
  return prisma.entryBookingLimitation.findMany({
    where: { objectEntryId: id },
    orderBy: [{ start: 'asc' }],
  });
};

export const createBookingLimitation = (data: CreateBookingLimitationDTO) => {
  return prisma.entryBookingLimitation.create({
    data: { ...data, start: dayjs(data.start).toDate(), end: dayjs(data.end).toDate() },
  });
};

export const deleteBookingLimitation = (id: string) => {
  return prisma.entryBookingLimitation.delete({ where: { id } });
};
