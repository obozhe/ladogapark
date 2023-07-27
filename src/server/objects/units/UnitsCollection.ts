import { CreateObjectUnitDTO, UpdateObjectUnitDTO } from './types';
import prisma from 'core/prisma';

export const createObjectUnit = ({ objectEntryId, number }: CreateObjectUnitDTO) => {
  return prisma.objectUnit.create({
    data: {
      objectEntryId,
      number,
    },
  });
};

export const getObjectUnitsByObjectEntryId = (id: string) => {
  return prisma.objectUnit.findMany({
    where: { objectEntryId: id },
    orderBy: [{ number: 'asc' }],
  });
};

export const getObjectUnitsNumbers = () => {
  return prisma.objectUnit.findMany({ select: { number: true } });
};

export const updateObjectUnit = (id: string, { number, isActive }: UpdateObjectUnitDTO) => {
  return prisma.objectUnit.update({
    where: { id },
    data: { ...(number ? { number } : {}), ...(isActive !== undefined ? { isActive } : {}) },
  });
};

export const deleteObjectUnit = (id: string) => {
  return prisma.objectUnit.delete({ where: { id } });
};
