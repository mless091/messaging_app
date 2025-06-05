'use client';

import { signOut, useSession } from 'next-auth/react';

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <div className="h-14 px-4 flex items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="font-semibold text-lg">Echo Messaging</div>

      <div className="flex items-center gap-4">
        {session?.user?.name && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Signed in as <strong>{session.user.name}</strong>
          </span>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
