'use client';

import { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Link from 'next/link';

export default function Home() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-5xl font-bold mb-4 text-center">Echo Messaging</h1>
      <p className="text-lg text-center max-w-md mb-8">
        A real-time chat platform for quick and secure conversations. Stay connected with ease.
      </p>


      {!authMode && (
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setAuthMode('login')}
            className="bg-white text-indigo-800 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Log In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className="bg-white text-indigo-800 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Sign Up
          </button>
        </div>
      )}

      <div className="w-full max-w-sm mt-6">
        {authMode === 'login' && (
          <>
            <LoginForm />
            <button
              onClick={() => setAuthMode(null)}
              className="mt-4 text-sm text-indigo-200 hover:underline"
            >
              Back to home
            </button>
          </>
        )}

        {authMode === 'signup' && (
          <>
            <SignupForm />
            <button
              onClick={() => setAuthMode(null)}
              className="mt-4 text-sm text-indigo-200 hover:underline"
            >
              Back to home
            </button>
          </>
        )}
      </div>
    </main>
  );
}
