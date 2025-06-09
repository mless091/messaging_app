import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get('q');

  if (!search || search.trim() === '') {
    return NextResponse.json([]);
  }

  const results = await db.$queryRawUnsafe(`
    SELECT id, name FROM "User"
    WHERE name ILIKE '%' || $1 || '%'
    AND email != $2
    LIMIT 50
  `, search, session.user.email);

  return NextResponse.json(results);
}
