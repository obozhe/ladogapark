import { NextRequest, NextResponse } from 'next/server';
import { createEntryFuturePrice } from 'server/objects/ObjectCollection';
import { CreateFuturePriceDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateFuturePriceDTO;

  return NextResponse.json(await createEntryFuturePrice(body));
}
