import { NextRequest, NextResponse } from 'next/server';
import { CreateObjectUnitDTO } from './../../../../../server/objects/units/types';
import { createObjectUnit, getObjectUnitsByObjectEntryId } from 'server/objects/units/UnitsCollection';

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getObjectUnitsByObjectEntryId(objectEntryId));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateObjectUnitDTO;
  const createdUnit = await createObjectUnit(body);

  return NextResponse.json(await getObjectUnitsByObjectEntryId(createdUnit.objectEntryId));
}
