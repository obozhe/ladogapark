import { NextResponse } from 'next/server';
import { getObjectGroups } from 'server/objects/ObjectsCollection';

export async function GET() {
  return NextResponse.json(await getObjectGroups());
}
