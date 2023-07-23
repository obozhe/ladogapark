import { NextResponse } from 'next/server';
import { getObjectGroups } from 'server/objects/ObjectCollection';

export async function GET() {
  return NextResponse.json(await getObjectGroups());
}
