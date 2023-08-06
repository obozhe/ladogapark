import dayjs from 'dayjs';
import prisma from 'core/prisma';
import { CreateObjectUnitDTO, UpdateObjectUnitDTO } from './types';

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
    include: { temporaryClosures: { orderBy: { start: 'asc' } } },
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

export const deleteObjectUnit = async (id: string) => {
  await prisma.unitTemporaryClosure.deleteMany({ where: { objectUnitId: id } });
  return prisma.objectUnit.delete({ where: { id } });
};

export const createTemporaryClosure = (id: string, start: string, end: string) => {
  return prisma.unitTemporaryClosure.create({
    data: { start: dayjs(start).toDate(), end: dayjs(end).toDate(), objectUnitId: id },
    include: { objectUnit: true },
  });
};

export const deleteTemporaryClosure = (id: string) => {
  return prisma.unitTemporaryClosure.delete({ where: { id }, include: { objectUnit: true } });
};
