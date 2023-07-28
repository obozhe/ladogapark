import { NextRequest, NextResponse } from 'next/server';
import { createTemporaryClosure, deleteTemporaryClosure } from 'server/objects/units/UnitsCollection';
import { CreateUnitTemporaryClosureDTO } from 'server/objects/units/types';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { unitId, start, end } = (await req.json()) as CreateUnitTemporaryClosureDTO;

  return NextResponse.json(await createTemporaryClosure(unitId, start, end));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };

  return NextResponse.json(await deleteTemporaryClosure(id));
}
