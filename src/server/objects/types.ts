import { Prisma } from '@prisma/client';

export enum ObjectTypes {
  Daily = 'Daily',
  House = 'House',
  Bath = 'Bath',
}

// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
const entryWithGroup = Prisma.validator<Prisma.EntryArgs>()({
  include: { group: true },
});
export type EntryWithGroup = Prisma.EntryGetPayload<typeof entryWithGroup>;

const unitWithEntryWithGroup = Prisma.validator<Prisma.UnitArgs>()({
  include: { entry: { include: { group: true } } },
});
export type UnitWithGroupWithEntry = Prisma.UnitGetPayload<typeof unitWithEntryWithGroup>;

export type CreateFuturePriceDTO = {
  entryId: string;
  priceWeekend: number;
  priceWeekday: number;
  start: string;
};

export type CreateHolidayPriceDTO = { entryId: string; price: number; start: string; end: string };

export type CreateBookingLimitationDTO = { entryId: string; minDays: number; start: string; end: string };

export type CreateDiscountByDaysDTO = {
  entryId: string;
  daysCount: number;
  discount: number;
  start: string;
  end: string;
};

export type CreatePromoCodeByBookingDTO = {
  entryId: string;
  minDays: number;
  discount: number;
  validityDays: number;
  discountedEntriesIds: string[];
};
