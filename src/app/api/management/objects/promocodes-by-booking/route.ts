import { NextRequest, NextResponse } from 'next/server';
import {
  createPromoCodesByBooking,
  deleteDiscountsByDays,
  getPromoCodesByBookingByEntryId,
} from 'server/objects/ObjectCollection';
import { CreatePromoCodeByBookingDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreatePromoCodeByBookingDTO;
  const newPromoCode = await createPromoCodesByBooking(body);

  return NextResponse.json(await getPromoCodesByBookingByEntryId(newPromoCode.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getPromoCodesByBookingByEntryId(objectEntryId));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  if (!id) {
    throw new Error('Not valid id');
  }

  const deletedPromoCode = await deleteDiscountsByDays(id);

  return NextResponse.json(await getPromoCodesByBookingByEntryId(deletedPromoCode.objectEntryId));
}
