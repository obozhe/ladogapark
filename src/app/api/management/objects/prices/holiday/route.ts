import { NextRequest, NextResponse } from 'next/server';
import { createEntryFuturePrice, getEntryHolidayPrices } from 'server/objects/ObjectCollection';
import { createEntryHolidayPrice } from 'server/objects/ObjectCollection';
import { CreateHolidayPriceDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateHolidayPriceDTO;
  const newHolidayPrice = await createEntryHolidayPrice(body);

  return NextResponse.json(await getEntryHolidayPrices(newHolidayPrice.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getEntryHolidayPrices(objectEntryId));
}
