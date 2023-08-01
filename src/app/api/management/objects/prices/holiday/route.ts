import { NextRequest, NextResponse } from 'next/server';
import { createEntryHolidayPrice } from 'server/objects/ObjectCollection';
import { CreateHolidayPriceDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateHolidayPriceDTO;

  return NextResponse.json(await createEntryHolidayPrice(body));
}
