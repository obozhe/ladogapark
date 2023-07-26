import prisma from 'core/prisma';

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
