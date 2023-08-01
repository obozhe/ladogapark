import { Prisma } from '@prisma/client';

export enum ObjectTypes {
  Daily = 'Daily',
  House = 'House',
  Bath = 'Bath',
}

// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
const objectEntryWithGroup = Prisma.validator<Prisma.ObjectEntryArgs>()({
  include: { objectGroup: true },
});
export type ObjectEntryWithGroup = Prisma.ObjectEntryGetPayload<typeof objectEntryWithGroup>;

export type CreateFuturePriceDTO = {
  objectEntryId: string;
  priceWeekend: number;
  priceWeekday: number;
  start: string;
};

export type CreateHolidayPriceDTO = { objectEntryId: string; price: number; start: string; end: string };
