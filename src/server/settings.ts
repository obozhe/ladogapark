import { cache } from 'react';
import prisma from 'core/prisma';

export const getSettings = cache(() => {
  return prisma.settings.findFirst();
});
