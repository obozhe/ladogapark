import prisma from 'core/prisma';

export const getCommonCommodities = () => {
  return prisma.commodity.findMany({ where: { entry: null } });
};
