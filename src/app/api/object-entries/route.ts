import { NextResponse } from 'next/server';
import { getObjectEntries } from 'server/objects/ObjectsCollection';

export async function GET() {
  return NextResponse.json(await getObjectEntries());
}
