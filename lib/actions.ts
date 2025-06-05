//actions.ts
'use server';

import bcrypt from 'bcryptjs';
import { db } from './db';
//import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';


export async function handleSignup({ email, displayName, password }: { email: string, displayName: string, password: string }) {
  try {
    // Check for existing email
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Email is already in use.' };
    }

    // Check for existing display name
    const existingDisplay = await db.user.findFirst({ where: { name: displayName } });
    if (existingDisplay) {
      return { success: false, error: 'Display name is already taken.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        email,
        name: displayName,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: 'Something went wrong while creating the account.' };
  }
}


export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Missing email or password');
  }

  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    console.log('signIn result:', result); // Debug line

    if (result?.error) {
      throw new Error('Invalid email or password');
    }

    redirect('/chat');
  } catch (err: any) {
    throw new Error(err.message || 'Login failed. Please try again.');
  }
}