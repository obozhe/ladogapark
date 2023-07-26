import { NextResponse } from 'next/server';
import { getUsers } from 'server/users/UserCollection';

export async function GET() {
  return NextResponse.json(await getUsers());
}

// export async function POST(req: NextRequest) {
//   return NextResponse.json(await userService.create(req.body as UserCreate));
// }
