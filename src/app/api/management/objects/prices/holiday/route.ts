import { NextRequest, NextResponse } from 'next/server';
import { createHolidayPrice, deleteHolidayPrice, getHolidayPrices } from 'server/objects/ObjectCollection';
import { CreateHolidayPriceDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateHolidayPriceDTO;
  const newHolidayPrice = await createHolidayPrice(body);

  return NextResponse.json(await getHolidayPrices(newHolidayPrice.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getHolidayPrices(objectEntryId));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  if (!id) {
    throw new Error('Not valid id');
  }

  const deletedEntryFuturePrice = await deleteHolidayPrice(id);
  return NextResponse.json(await getHolidayPrices(deletedEntryFuturePrice.objectEntryId));
}
