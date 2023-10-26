import { Season } from '@prisma/client';
import prisma from 'core/prisma';

export const getGalleryImages = (season: Season) => {
  return prisma.galleryImage.findMany({ orderBy: { sorting: 'asc' }, where: { status: 'Active' } });
};

export const getMainPageImages = () => {
  return prisma.galleryImage.findMany({ take: 4, orderBy: { sorting: 'asc' }, where: { status: 'Active' } });
};
