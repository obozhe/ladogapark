import { NextRequest, NextResponse } from 'next/server';
import { UpdateObjectUnitDTO } from 'server/objects/units/types';
import { updateObjectUnit } from 'server/objects/units/UnitsCollection';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const body = (await req.json()) as UpdateObjectUnitDTO;

  return NextResponse.json(await updateObjectUnit(context.params.id, body));
}
