'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { auth, googleProvider } from '@/lib/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ro } from 'date-fns/locale';
import { AuthService } from '@/services/AuthService';

// Validation Schema
const signupSchema = z.object({
  displayName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['contestant', 'judge', 'user'])
});

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      role: 'contestant'
    }
  });

  const [loading, setLoading] = useState(false);

  // Handle Signup
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const user = await AuthService.signUpWithEmail(
        data.email,
        data.password,
        data.displayName,
        data.role
      );

      toast.success('Signup successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // Google Signup

  return (
    <div
      className='flex min-h-screen items-center justify-center bg-gray-100 bg-cover bg-center p-4'
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1629327896333-7ecec1515ae5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      }}
    >
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader>
          <CardTitle className='text-center text-xl'>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Input placeholder='Full Name' {...register('displayName')} />
              {errors.displayName && (
                <p className='text-sm text-red-500'>
                  {errors.displayName.message}
                </p>
              )}
            </div>
            <div>
              <Input type='email' placeholder='Email' {...register('email')} />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type='password'
                placeholder='Password'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className='text-sm font-medium'>Select Role</label>
              <Select onValueChange={(value) => setValue('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='contestant'>Contestant</SelectItem>
                  <SelectItem value='judge'>Judge</SelectItem>
                  <SelectItem value='user'>User</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className='text-sm text-red-500'>{errors.role.message}</p>
              )}
            </div>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          <p className='mt-2 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <a href='/' className='text-blue-600'>
              Sign In
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
