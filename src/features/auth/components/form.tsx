import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GithubSignInButton from './github-auth-button';
import GoogleSignInButton from './google-auth-button';
import FacebookSignInButton from './facebook-auth-button';

export default function Component() {
  return (
    <Card className='relative z-10 mx-auto w-full'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' required />
          </div>
          <Button type='submit' className='w-full'>
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
      </CardContent>
    </Card>
  );
}
