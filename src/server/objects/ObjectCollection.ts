import prisma from 'core/prisma';

export const getEntryById = (id: string) => {
  return prisma.entry.findUnique({ where: { id }, include: { group: true } });
};

export const getObjectEntries = () => {
  return prisma.entry.findMany({ include: { group: true } });
};

export const getGroups = () => {
  return prisma.group.findMany();
};

export const getGroupById = (id: string) => {
  return prisma.group.findUnique({ where: { id }, include: { entries: true } });
};
