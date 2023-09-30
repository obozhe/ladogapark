import prisma from 'core/prisma';

export const getGalleryImages = () => {
  return prisma.galleryImage.findMany({ orderBy: { sorting: 'asc' }, where: { status: 'Active' } });
};

export const getMainPageImages = () => {
  return prisma.galleryImage.findMany({ take: 4, orderBy: { sorting: 'asc' }, where: { status: 'Active' } });
};
