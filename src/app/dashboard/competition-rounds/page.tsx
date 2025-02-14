'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import { RoundService } from '@/services/Services';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth-context';

export interface Round {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  maxContestants: number;
  judgeIds: string[];
  votingEnabled: boolean;
  votingStartDate?: Date;
  votingEndDate?: Date;
  createdAt: Date;
  createdBy: string;
}

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function getTimeRemaining(date: Date) {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

function RoundCard({ round }: { round: Round }) {
  const { user } = useAuth();
  const router = useRouter();

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const handleParticipate = () => {
    if (user) {
      router.push(`/submissions?roundId=${round.id}&contestantId=${user!.uid}`);
    } else {
      console.error('User profile is null');
    }
  };

  return (
    <Card className='transition-shadow duration-200 hover:shadow-lg'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle className='mb-2 text-xl'>{round.name}</CardTitle>
            <CardDescription>{round.description}</CardDescription>
          </div>
          <Badge className={statusColors[round.status]}>
            {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-gray-500' />
              <span className='text-sm'>{formatDateTime(round.startDate)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-gray-500' />
              <span className='text-sm'>{getTimeRemaining(round.endDate)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-gray-500' />
              <span className='text-sm'>
                {round.maxContestants} max contestants
              </span>
            </div>
          </div>

          {round.votingEnabled && (
            <div className='rounded-md bg-blue-50 p-3'>
              <p className='text-sm text-blue-700'>
                Voting period:{' '}
                {round.votingStartDate && formatDateTime(round.votingStartDate)}{' '}
                -{round.votingEndDate && formatDateTime(round.votingEndDate)}
              </p>
            </div>
          )}

          <button
            onClick={handleParticipate}
            className='w-full rounded-md bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700'
          >
            Participate Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompetitionRounds() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadRounds = async () => {
      try {
        const rounds = await RoundService.getRounds();
        setRounds(rounds);
      } catch (error) {
        console.error('Failed to load rounds:', error);
      }
    };

    loadRounds();
  }, []);

  const filterRounds = (status: Round['status']) => {
    return rounds.filter((round) => round.status === status);
  };

  return (
    <div className='mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Competition Rounds</h1>
        <p className='text-gray-600'>
          View and participate in competition rounds
        </p>
      </div>

      <Tabs defaultValue='active' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='space-y-6'>
          {filterRounds('upcoming').map((round) => (
            <RoundCard key={round.id} round={round} />
          ))}
        </TabsContent>

        <TabsContent value='upcoming' className='space-y-6'>
          {filterRounds('upcoming').map((round) => (
            <RoundCard key={round.id} round={round} />
          ))}
        </TabsContent>

        <TabsContent value='completed' className='space-y-6'>
          {filterRounds('completed').map((round) => (
            <RoundCard key={round.id} round={round} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
