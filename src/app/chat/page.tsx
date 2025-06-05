'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import type { FullConversation } from 'src/app/types';

export default function ChatPage() {
  const [selectedConv, setSelectedConv] = useState<FullConversation | null>(null);

  return (
    <div className="flex flex-1 h-full">
      <Sidebar onSelectConversation={setSelectedConv} />
      <ChatWindow conversation={selectedConv} />
    </div>
  );
}
