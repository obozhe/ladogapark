import { NextRequest, NextResponse } from 'next/server';
import {
  createBookingLimitation,
  deleteBookingLimitation,
  getBookingLimitationsByEntryId,
} from 'server/objects/ObjectCollection';
import { CreateBookingLimitationDTO } from 'server/objects/types';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateBookingLimitationDTO;
  const newBookingLimitation = await createBookingLimitation(body);

  return NextResponse.json(await getBookingLimitationsByEntryId(newBookingLimitation.objectEntryId));
}

export async function GET(req: NextRequest) {
  const objectEntryId = req.nextUrl.searchParams.get('objectEntryId');
  if (!objectEntryId) {
    throw new Error('Not valid objectEntryId');
  }

  return NextResponse.json(await getBookingLimitationsByEntryId(objectEntryId));
}

export async function DELETE(req: NextRequest) {
  const { id } = (await req.json()) as { id: string };
  if (!id) {
    throw new Error('Not valid id');
  }

  const deletedBookingLimitation = await deleteBookingLimitation(id);
  return NextResponse.json(await getBookingLimitationsByEntryId(deletedBookingLimitation.objectEntryId));
}
