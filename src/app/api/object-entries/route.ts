import { NextResponse } from 'next/server';
import { getObjectEntries } from 'server/objects/ObjectCollection';

export async function GET() {
  return NextResponse.json(await getObjectEntries());
}
