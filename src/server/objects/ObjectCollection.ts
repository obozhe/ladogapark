import dayjs from 'dayjs';
import prisma from 'core/prisma';
import { CreateFuturePriceDTO, CreateHolidayPriceDTO } from './types';

export const getObjectGroupById = (id: string) => {
  return prisma.objectGroup.findUnique({ where: { id } });
};

export const getObjectEntryById = (id: string) => {
  return prisma.objectEntry.findUnique({ where: { id }, include: { objectGroup: true } });
};

export const getObjectEntries = () => {
  return prisma.objectEntry.findMany({ include: { objectGroup: true } });
};

export const getObjectGroupsWithObjects = () => {
  return prisma.objectGroup.findMany({
    include: {
      objectEntries: true,
    },
  });
};

export const createEntryFuturePrice = (data: CreateFuturePriceDTO) => {
  return prisma.entryFuturePrice.create({ data: { ...data, start: dayjs(data.start).toDate() } });
};

export const createEntryHolidayPrice = (data: CreateHolidayPriceDTO) => {
  return prisma.entryHolidayPrice.create({
    data: { ...data, start: dayjs(data.start).toDate(), end: dayjs(data.end).toDate() },
  });
};
