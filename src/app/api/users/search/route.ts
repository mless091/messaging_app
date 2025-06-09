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

 const results = await db.user.findMany({
  where: {
    AND: [
      {
        name: {
          contains: search.toLowerCase(), // search lowercase
        },
      },
      {
        email: {
          not: session.user.email,
        },
      },
    ],
  },
  select: {
    id: true,
    name: true,
  },
  take: 50, // optionally increase results for filtering
});

// Filter in JS if needed
const filtered = results.filter((user) =>
  user.name.toLowerCase().includes(search.toLowerCase())
);

return NextResponse.json(filtered);

}
