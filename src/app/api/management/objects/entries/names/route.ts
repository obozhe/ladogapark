import { NextResponse } from 'next/server';
import { getObjectEntriesNames } from 'server/objects/ObjectCollection';

export async function GET() {
  return NextResponse.json(await getObjectEntriesNames());
}
