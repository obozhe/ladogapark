import prisma from 'core/prisma';

export const getGalleryImages = () => {
  return prisma.galleryImage.findMany();
};
