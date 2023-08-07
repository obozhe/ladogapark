import { NextRequest, NextResponse } from 'next/server';
import { createFuturePrice, deleteFuturePrice, getFuturePrices } from 'server/objects/ObjectCollection';
import { CreateFuturePriceDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateFuturePriceDTO;
  const newFuturePrice = await createFuturePrice(body);

  return NextResponse.json(await getFuturePrices(newFuturePrice.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getFuturePrices(objectEntryId));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  if (!id) {
    throw new Error('Not valid id');
  }

  const deletedEntryFuturePrice = await deleteFuturePrice(id);
  return NextResponse.json(await getFuturePrices(deletedEntryFuturePrice.objectEntryId));
}
