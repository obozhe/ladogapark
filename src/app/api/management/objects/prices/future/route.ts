import { NextRequest, NextResponse } from 'next/server';
import { getEntryFuturePrices } from './../../../../../../server/objects/ObjectCollection';
import { createEntryFuturePrice } from 'server/objects/ObjectCollection';
import { CreateFuturePriceDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateFuturePriceDTO;
  const newFuturePrice = await createEntryFuturePrice(body);

  return NextResponse.json(await getEntryFuturePrices(newFuturePrice.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getEntryFuturePrices(objectEntryId));
}
