import prisma from 'core/prisma';

export const getEntryById = (id: string) => {
  return prisma.entry.findUnique({ where: { id }, include: { group: true } });
};

export const getEntryByIdWithFuturePrices = (id: string) => {
  return prisma.entry.findUnique({ where: { id }, include: { group: true, futurePrices: true, extraServices: true } });
};

export const getEntryByIdWithFutureWithService = (id: string) => {
  return prisma.entry.findUnique({
    where: { id },
    include: { group: true, futurePrices: true, extraServices: true, units: true },
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
