import { UserCreate } from './types';
import prisma from 'lib/prisma';
import { NextResponse } from 'next/server';
import userService from './service';
import bcrypt from 'bcrypt';

export async function GET() {
  return NextResponse.json(await prisma.user.findMany());
}

export async function POST(user: UserCreate) {
  return NextResponse.json(await userService.create(user));
}
