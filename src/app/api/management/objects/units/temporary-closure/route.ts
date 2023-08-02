import { NextRequest, NextResponse } from 'next/server';
import {
  createTemporaryClosure,
  deleteTemporaryClosure,
  getObjectUnitsByObjectEntryId,
} from 'server/objects/units/UnitsCollection';
import { CreateUnitTemporaryClosureDTO } from 'server/objects/units/types';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { unitId, start, end } = (await req.json()) as CreateUnitTemporaryClosureDTO;
  const createdClosure = await createTemporaryClosure(unitId, start, end);

  return NextResponse.json(await getObjectUnitsByObjectEntryId(createdClosure.objectUnit.objectEntryId));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  const deletedClosure = await deleteTemporaryClosure(id);

  return NextResponse.json(await getObjectUnitsByObjectEntryId(deletedClosure.objectUnit.objectEntryId));
}
