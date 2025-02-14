import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GithubSignInButton from './github-auth-button';
import GoogleSignInButton from './google-auth-button';
import FacebookSignInButton from './facebook-auth-button';
import { AuthService } from '@/services/AuthService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Component({ onSubmit }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const handleLogin = async () => {
    try {
      const res = await AuthService.signInWithEmail(email, password);
      console.log('Login Response:', res);
      toast.success('Signin successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card className='relative z-10 mx-auto w-full'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type='submit' className='w-full' onClick={handleLogin}>
              Login
            </Button>
          </div>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative mt-2 flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>
          {/* <GithubSignInButton /> */}
          <GoogleSignInButton />
          <FacebookSignInButton />

          {/* link to sign up */}
          <div className='mt-4 flex items-center justify-center'>
            <p className='text-sm text-gray-500'>Don't have an account?</p>
            <a href='/signup' className='ml-1 text-blue-600'>
              Sign Up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
