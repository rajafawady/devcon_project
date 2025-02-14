'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { StarIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';
import Form from './form';
// export const metadata: Metadata = {
//   title: 'Authentication',
//   description: 'Authentication forms built using the components.'
// };

// export default function SignInViewPage({ stars }: { stars: number }) {
//   return (
//     <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
//       <Link
//         href='/examples/authentication'
//         className={cn(
//           buttonVariants({ variant: 'ghost' }),
//           'absolute right-4 top-4 hidden md:right-8 md:top-8'
//         )}
//       >
//         Login
//       </Link>
//       <div className='relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex'>
//         <div
//           style={{
//             backgroundImage:
//               'url(https://images.unsplash.com/photo-1629327896333-7ecec1515ae5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//             // height: '100%',
//             // width: '300px'
//           }}
//           className='absolute h-screen w-full'
//         />

//         <div className='relative z-20 mt-auto'>
//           <blockquote className='space-y-2'></blockquote>
//         </div>
//       </div>
//       <div className='flex h-full items-center p-4 lg:p-8'>

// </div>
//     </div>
//   );
// }

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: any) => {
    console.log('Login Data:', data);
    // Handle authentication logic here
  };

  return (
    <div className='relative flex h-screen w-full items-center justify-center'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1629327896333-7ecec1515ae5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      />

      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black/50'></div>
      <div className='w-[400px]'>
        <Form onSubmit={handleSubmit(onSubmit)} />
      </div>
      {/* Dark Overlay */}

      {/* Login Card */}
      {/* <Card className='relative z-10 w-full max-w-md bg-white/90 shadow-lg backdrop-blur-lg'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' {...register('email')} />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' {...register('password')} />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </form>
        </CardContent>
      </Card> */}
    </div>
  );
}
