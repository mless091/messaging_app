import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import Topbar from './Topbar';
import type { FullConversation } from 'src/app/types';

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState<FullConversation | null>(null);

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectConversation={setSelectedConversation} />
        <ChatWindow conversation={selectedConversation} />
      </div>
    </div>
  );
}
