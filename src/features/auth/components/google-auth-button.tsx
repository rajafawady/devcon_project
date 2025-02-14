'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { loginWithGoogle } from '@/lib/firebase/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const handler = async () => {
    await loginWithGoogle();
    toast.success('Signin successful!');
    window.location.href = '/dashboard';
  };
  return (
    <Button
      className='mt-2 w-full'
      variant='outline'
      type='button'
      onClick={handler}
    >
      <Icons.google className='mr-2 h-4 w-4' />
      Continue with Google
    </Button>
  );
}
