import { getObjectUnitsNumbers } from 'server/objects/units/UnitsCollection';
import { NextResponse } from 'next/server';
import _ from 'lodash';

export async function GET() {
  const numbers = await getObjectUnitsNumbers();
  return NextResponse.json(_(numbers).map('number'));
}
