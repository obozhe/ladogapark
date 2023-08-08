import dayjs from 'dayjs';
import prisma from 'core/prisma';
import {
  CreateBookingLimitationDTO,
  CreateDiscountByDaysDTO,
  CreateFuturePriceDTO,
  CreateHolidayPriceDTO,
  CreatePromoCodeByBookingDTO,
} from './types';

export const getObjectGroupById = (id: string) => {
  return prisma.objectGroup.findUnique({ where: { id } });
};

export const getObjectEntryById = (id: string) => {
  return prisma.objectEntry.findUnique({ where: { id }, include: { objectGroup: true } });
};

export const getObjectEntries = () => {
  return prisma.objectEntry.findMany({ include: { objectGroup: true } });
};

export const getObjectEntriesNames = () => {
  return prisma.objectEntry.findMany({ select: { title: true, id: true }, orderBy: { title: 'asc' } });
};

export const getObjectGroupsWithObjects = () => {
  return prisma.objectGroup.findMany({
    include: {
      objectEntries: true,
    },
  });
};

/*---FUTURE_PRICE---*/
export const createFuturePrice = (data: CreateFuturePriceDTO) => {
  return prisma.entryFuturePrice.create({ data: { ...data, start: dayjs(data.start).toDate() } });
};

export const getFuturePrices = (objectEntryId: string) => {
  return prisma.entryFuturePrice.findMany({ where: { objectEntryId }, orderBy: [{ start: 'asc' }] });
};

export const deleteFuturePrice = (id: string) => {
  return prisma.entryFuturePrice.delete({ where: { id } });
};

/*---HOLIDAY_PRICE---*/
export const createHolidayPrice = (data: CreateHolidayPriceDTO) => {
  return prisma.entryHolidayPrice.create({
    data: { ...data, start: dayjs(data.start).toDate(), end: dayjs(data.end).toDate() },
  });
};

export const getHolidayPrices = (objectEntryId: string) => {
  return prisma.entryHolidayPrice.findMany({ where: { objectEntryId }, orderBy: [{ start: 'asc' }] });
};

export const deleteHolidayPrice = (id: string) => {
  return prisma.entryHolidayPrice.delete({ where: { id } });
};

/*---BOOKING_LIMITATION---*/
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

/*---DISCOUNT_BY_DAYS---*/
export const getDiscountsByDaysByEntryId = (id: string) => {
  return prisma.entryDiscountByDays.findMany({
    where: { objectEntryId: id },
    orderBy: [{ start: 'asc' }],
  });
};

export const createDiscountsByDays = (data: CreateDiscountByDaysDTO) => {
  return prisma.entryDiscountByDays.create({
    data: { ...data, start: dayjs(data.start).toDate(), end: dayjs(data.end).toDate() },
  });
};

export const deleteDiscountsByDays = (id: string) => {
  return prisma.entryDiscountByDays.delete({ where: { id } });
};

/*---PROMOCODE_BY_BOOKING---*/
export const getPromoCodesByBookingByEntryId = (id: string) => {
  return prisma.entryPromoCodeByBooking.findMany({
    where: { objectEntryId: id },
  });
};

export const createPromoCodesByBooking = (data: CreatePromoCodeByBookingDTO) => {
  return prisma.entryPromoCodeByBooking.create({ data });
};

export const deleteDPromoCodesByBooking = (id: string) => {
  return prisma.entryPromoCodeByBooking.delete({ where: { id } });
};
