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
import { Calendar, Clock, Trophy, Music, AlertCircle } from 'lucide-react';
import { RoundService } from '@/services/Services';
import { useRouter } from 'next/navigation';

interface Round {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants: number;
  requirementsDescription: string;
  genre?: string;
}

interface PerformanceSlot {
  id: string;
  roundId: string;
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked' | 'completed';
  contestantId?: string;
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

function RoundCard({
  round,
  onSlotSelect
}: {
  round: Round;
  onSlotSelect: (roundId: string) => void;
}) {
  const [slots, setSlots] = useState<PerformanceSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleSlotSelect = (roundId: string, slotId: string) => {
    router.push(
      `/performance-submission?contestantId=user123&roundId=${roundId}&slotId=${slotId}`
    );
  };

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const availableSlots = await RoundService.getAvailableSlots(round.id);
        setSlots(availableSlots);
      } catch (error) {
        console.error('Failed to load slots:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [round.id]);

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card className='transition-shadow duration-200 hover:shadow-lg'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle className='mb-2 text-xl'>{round.title}</CardTitle>
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
            {round.genre && (
              <div className='flex items-center gap-2'>
                <Music className='h-4 w-4 text-gray-500' />
                <span className='text-sm'>{round.genre}</span>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <Trophy className='h-4 w-4 text-gray-500' />
              <span className='text-sm'>{slots.length} slots available</span>
            </div>
          </div>

          {loading ? (
            <div className='py-4 text-center'>
              <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
            </div>
          ) : slots.length > 0 ? (
            <div>
              <h4 className='mb-2 text-sm font-medium'>Available Slots:</h4>
              <div className='grid grid-cols-2 gap-2'>
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onSlotSelect(round.id)}
                    className='rounded-md border border-gray-200 p-2 text-left transition-colors duration-200 hover:border-blue-500 hover:bg-blue-50'
                  >
                    <div className='text-sm font-medium'>
                      {formatDateTime(slot.startTime)}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {new Date(slot.endTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-center gap-2 py-4 text-gray-500'>
              <AlertCircle className='h-5 w-5' />
              <span>No slots available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompetitionRounds() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  const handleSlotSelect = (roundId: string) => {
    setSelectedRoundId(roundId);
    // You could navigate to the performance submission page here
    // or open a modal for slot selection
  };

  const filterRounds = (status: Round['status']) => {
    return rounds.filter((round) => round.status === status);
  };

  return (
    <div className='mx-auto max-w-6xl p-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Competition Rounds</h1>
        <p className='text-gray-600'>
          View and participate in competition rounds
        </p>
      </div>

      <Tabs defaultValue='ongoing' className='space-y-6'>
        <TabsList className='grid w-full max-w-md grid-cols-3'>
          <TabsTrigger value='ongoing'>Ongoing</TabsTrigger>
          <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
        </TabsList>

        <TabsContent value='ongoing' className='space-y-6'>
          {filterRounds('ongoing').map((round) => (
            <RoundCard
              key={round.id}
              round={round}
              onSlotSelect={handleSlotSelect}
            />
          ))}
        </TabsContent>

        <TabsContent value='upcoming' className='space-y-6'>
          {filterRounds('upcoming').map((round) => (
            <RoundCard
              key={round.id}
              round={round}
              onSlotSelect={handleSlotSelect}
            />
          ))}
        </TabsContent>

        <TabsContent value='completed' className='space-y-6'>
          {filterRounds('completed').map((round) => (
            <RoundCard
              key={round.id}
              round={round}
              onSlotSelect={handleSlotSelect}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
