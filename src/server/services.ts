import prisma from 'core/prisma';

export const getServicesSorted = () => {
  return prisma.service.findMany({ orderBy: { sorting: 'asc' } });
};

export const getServicesMain = () => {
  return prisma.service.findMany({ where: { isOnHomepage: true } });
};
