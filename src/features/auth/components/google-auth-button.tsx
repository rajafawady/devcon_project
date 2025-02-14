'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { loginWithGoogle } from '@/lib/firebase/auth';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className='mt-2 w-full'
      variant='outline'
      type='button'
      onClick={loginWithGoogle}
    >
      <Icons.google className='mr-2 h-4 w-4' />
      Continue with Google
    </Button>
  );
}
