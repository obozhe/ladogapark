import { NextRequest, NextResponse } from 'next/server';
import {
  deleteObjectUnit,
  getObjectUnitsByObjectEntryId,
  updateObjectUnit,
} from 'server/objects/units/UnitsCollection';
import { UpdateObjectUnitDTO } from 'server/objects/units/types';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const body = (await req.json()) as UpdateObjectUnitDTO;
  const updatedUnit = await updateObjectUnit(context.params.id, body);

  return NextResponse.json(await getObjectUnitsByObjectEntryId(updatedUnit.objectEntryId));
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const deletedUnit = await deleteObjectUnit(context.params.id);
  return NextResponse.json(await getObjectUnitsByObjectEntryId(deletedUnit.objectEntryId));
}
