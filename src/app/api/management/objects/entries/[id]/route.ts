import { getObjectEntryById } from 'server/objects/ObjectCollection';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json(await getObjectEntryById(context.params.id));
}
