'use client';

import { useEffect, useState } from 'react';
import type { FullConversation } from 'src/app/types';
import { useSession } from 'next-auth/react';

type UserSearchResult = {
  id: string;
  name: string;
};

type SidebarProps = {
  onSelectConversation: (conversation: FullConversation) => void;
};

export default function Sidebar({ onSelectConversation }: SidebarProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<FullConversation[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);

  const fetchConversations = async () => {
    const res = await fetch('/api/conversations');
    if (!res.ok) return;

    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return;

      const data = await res.json();
      setResults(data);
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleStartConversation = async (participantId: string) => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const newConv = await res.json();
      setConversations((prev) => [newConv, ...prev]);
      onSelectConversation(newConv);
      setShowSearch(false);
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r flex flex-col justify-between relative">
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const currentUserId = session?.user?.id;
          const other = conv.participants.find((p) => p.id !== currentUserId);

          return (
            <li
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="font-semibold">{other?.name || 'Unknown'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {conv.messages[0]?.content || 'No messages yet'}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t dark:border-gray-700 p-4">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="w-full py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start New Chat
        </button>
      </div>

      {showSearch && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 shadow-lg border dark:border-gray-700 p-4 z-20 rounded-md w-11/12 max-w-xs">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 mb-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <ul>
            {results.length === 0 && query && (
              <li className="text-sm text-gray-500 dark:text-gray-400">No users found</li>
            )}
            {results.map((user) => (
              <li
                key={user.id}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                onClick={() => handleStartConversation(user.id)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


