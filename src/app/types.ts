// types.ts
import type { Conversation, Message, User } from '@prisma/client';

export type FullConversation = Conversation & {
  participants: Pick<User, 'id' | 'name'>[];
  messages: Pick<Message, 'content'>[];
};
