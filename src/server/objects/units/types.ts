import { Prisma } from '@prisma/client';

export type CreateObjectUnitDTO = { number: string; objectEntryId: string };

export type UpdateObjectUnitDTO = { number?: string; isActive?: boolean };

export type CreateUnitTemporaryClosureDTO = { unitId: string; start: string; end: string };

const objectUnitWithClosedDates = Prisma.validator<Prisma.ObjectUnitArgs>()({
  include: { temporaryClosures: true },
});
export type ObjectUnitWithClosedDates = Prisma.ObjectUnitGetPayload<typeof objectUnitWithClosedDates>;
