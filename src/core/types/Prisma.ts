import { Prisma } from '@prisma/client';

const groupWithEntriesWithFuturePrices = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: { entries: { include: { futurePrices: true } } },
});

export type GroupWithEntriesWithFuturePrices = Prisma.GroupGetPayload<typeof groupWithEntriesWithFuturePrices>;
