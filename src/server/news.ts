import { Status } from '@prisma/client';
import prisma from 'core/prisma';

const today = new Date();

export const getNews = () => {
  return prisma.news.findMany({
    where: { start: { lte: today }, end: { gte: today }, status: Status.Active },
    orderBy: { start: 'desc' },
  });
};
