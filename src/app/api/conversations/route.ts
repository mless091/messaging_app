import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      conversations: {
        include: {
          participants: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user.conversations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { participantId } = await req.json();

  if (!participantId) {
    return NextResponse.json({ error: 'Participant ID required' }, { status: 400 });
  }

  // Find current user
  const currentUser = await db.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if conversation between these two users exists
  // Correct filtering using relation "some" on participants
  let conversation = await db.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: currentUser.id } } },
        { participants: { some: { id: participantId } } },
      ],
    },
    include: {
      participants: true,
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  if (!conversation) {
    // Create new conversation with two participants
    conversation = await db.conversation.create({
      data: {
        participants: {
          connect: [{ id: currentUser.id }, { id: participantId }],
        },
      },
      include: {
        participants: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }

  return NextResponse.json(conversation);
}
