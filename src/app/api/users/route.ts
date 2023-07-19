import { UserCreate } from './types';
import prisma from 'lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import userService from './service';
import bcrypt from 'bcrypt';

export async function GET() {
  const salt = await bcrypt.genSalt();
  console.log(salt);
  return NextResponse.json(await prisma.user.findMany());
}

// export async function POST(req: NextRequest) {
//   return NextResponse.json(await userService.create(req.body as UserCreate));
// }
