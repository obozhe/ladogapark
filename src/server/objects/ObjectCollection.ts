import { group } from 'console';
import prisma from 'core/prisma';

export const getEntryById = (id: string) => {
  return prisma.entry.findUnique({ where: { id }, include: { group: true } });
};

export const getEntryByIdWithFuturePrices = (id: string) => {
  return prisma.entry.findUnique({
    where: { id },
    include: { group: true, futurePrices: true, extraCommodities: true },
  });
};

export const getUnitByIdWithEntryWithGroup = (id: string) => {
  return prisma.unit.findUnique({ where: { id }, include: { entry: { include: { group: true } } } });
};

export const getEntryByIdWithFutureWithService = (id: string) => {
  return prisma.entry.findUnique({
    where: { id },
    include: {
      group: true,
      futurePrices: true,
      extraCommodities: true,
      units: true,
      includedCommodities: { include: { commodity: true } },
    },
  });
};

export const getObjectEntries = () => {
  return prisma.entry.findMany({ include: { group: true } });
};

export const getGroupsWithEntries = () => {
  return prisma.group.findMany({ include: { entries: true }, where: { entries: { none: {} } } });
};

export const getGroupsWithEntriesWithFuturePrices = () => {
  return prisma.group.findMany({
    include: { entries: { include: { futurePrices: true }, orderBy: { seats: 'asc' } } },
    where: { NOT: { entries: { none: {} } } },
  });
};

export const getGroupById = (id: string) => {
  return prisma.group.findUnique({ where: { id }, include: { entries: true } });
};
