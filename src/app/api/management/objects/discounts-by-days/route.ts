import { NextRequest, NextResponse } from 'next/server';
import {
  createDiscountsByDays,
  deleteDiscountsByDays,
  getDiscountsByDaysByEntryId,
} from 'server/objects/ObjectCollection';
import { CreateDiscountByDaysDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateDiscountByDaysDTO;
  const newBookingLimitation = await createDiscountsByDays(body);

  return NextResponse.json(await getDiscountsByDaysByEntryId(newBookingLimitation.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getDiscountsByDaysByEntryId(objectEntryId));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  if (!id) {
    throw new Error('Not valid id');
  }

  const deletedBookingLimitation = await deleteDiscountsByDays(id);
  return NextResponse.json(await getDiscountsByDaysByEntryId(deletedBookingLimitation.objectEntryId));
}
