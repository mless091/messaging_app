'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { handleSignup } from '@/lib/actions';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [display, setDisplay] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const result = await handleSignup({ email, displayName: display, password });

      if (result?.success) {
        setSuccess('Account created! Signing you in...');

        // Attempt to sign in immediately after signup
        const loginResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (loginResult?.error) {
          setError('Signup worked, but automatic login failed.');
        } else {
          router.push('/chat');
        }
      } else {
        setError(result?.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError('Signup failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold text-center">Sign Up</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <input
        className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
        type="text"
        placeholder="Display Name"
        value={display}
        onChange={(e) => setDisplay(e.target.value)}
        required
      />
      <input
        className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
        Sign Up
      </button>
    </form>
  );
}
