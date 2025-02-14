'use client';
import { useAuth } from '@/hooks/auth-context';

import { redirect } from 'next/navigation';

import { ContestantService } from '@/services/Services';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  // const session = await auth();

  // if (!session?.user) {
  //   return redirect('/');
  // } else {
  const [contestant, setContestant] = useState<any>(null);

  useEffect(() => {
    async function fetchContestant() {
      const contestants = await ContestantService.getContestant(user?.uid!);
      setContestant(contestants);
    }
    fetchContestant();
  }, []);
  const { user, userProfile } = useAuth();

  redirect('/dashboard/rounds');
  // }
}
