import _ from 'lodash';
import { NextResponse } from 'next/server';
import { getObjectUnitsNumbers } from 'server/objects/units/UnitsCollection';

export async function GET() {
  const numbers = await getObjectUnitsNumbers();
  return NextResponse.json(_(numbers).map('number'));
}
