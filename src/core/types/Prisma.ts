import { Prisma } from '@prisma/client';

const groupWithEntriesWithFuturePrices = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: { entries: { include: { futurePrices: true } } },
});

export type GroupWithEntriesWithFuturePrices = Prisma.GroupGetPayload<typeof groupWithEntriesWithFuturePrices>;

const entryWithFuturePricesWithGroup = Prisma.validator<Prisma.EntryDefaultArgs>()({
  include: { futurePrices: true, group: true },
});

export type EntryWithFuturePricesWithGroup = Prisma.EntryGetPayload<typeof entryWithFuturePricesWithGroup>;
