'use client';
import type { FullConversation } from 'src/app/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

type Message = {
  id: string;
  content: string;
  sender: { id: string; name: string };
};

type ChatWindowProps = {
  conversation: FullConversation | null;
};

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages function wrapped in useCallback
  const fetchMessages = useCallback(async () => {
    if (!conversation) return;

    try {
      const res = await fetch(`/api/messages?conversationId=${conversation.id}`);
      if (!res.ok) return;

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [conversation]);

  // Initial fetch when conversation changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Polling every 5 seconds to fetch new messages
  useEffect(() => {
    if (!conversation) return;

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [conversation, fetchMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversation) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id, content: input.trim() }),
      });
      if (!res.ok) throw new Error('Failed to send message');

      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
    } catch (error) {
      console.error(error);
    }
  };

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-between p-4 h-full flex-1">
      {/* Scrollable messages container */}
      <div className="flex flex-col flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender.id === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
              {!isCurrentUser && (
                <div className="text-xs text-gray-500 mb-1">{msg.sender.name}</div>
              )}
              <div
                className={`mb-2 p-2 rounded-xl w-max max-w-[60%] ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white self-end'
                    : 'bg-gray-300 text-black self-start'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Message input form */}
      {conversation && (
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
