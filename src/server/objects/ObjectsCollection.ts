import prisma from 'core/prisma';

export const getObjectEntries = () => {
  return prisma.objectEntry.findMany();
};

export const getObjectGroups = () => {
  return prisma.objectGroup.findMany();
};

export const getObjectGroupsWithObjects = () => {
  return prisma.objectGroup.findMany({
    include: {
      objectEntries: true,
    },
  });
};
