'use client';
import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  PlayCircle,
  Trophy,
  Clock,
  User,
  Info,
  Lock
} from 'lucide-react';
import { PerformanceService } from '@/services/Services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Performance {
  id: string;
  contestantId: string;
  roundId: string;
  slotId: string;
  mediaUrl: string;
  mediaType: 'audio' | 'video';
  songTitle: string;
  artist: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'scored';
  submittedAt: Date;
  notes?: string;
}

const VotingInterface = () => {
  const { id } = useParams();

  // Competition state
  const [showVoteAlert, setShowVoteAlert] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [performances, setPerformances] = useState<Performance[]>([]);
  useEffect(() => {
    async function fetchPerformances() {
      const performances = (await PerformanceService.getRoundPerformances(
        id as any
      )) as any;
      setPerformances(performances);
    }
    fetchPerformances();
  }, []);
  // Contestant data with more detailed information
  const [contestants, setContestants] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      song: 'Rolling in the Deep',
      votes: 1234,
      hasVoted: false,
      performance: {
        thumbnail: '/api/placeholder/320/180',
        duration: '3:45',
        uploadDate: '2024-02-14',
        views: 2543
      },
      details: {
        city: 'New York',
        age: 23,
        genre: 'Pop',
        previousRounds: ['Audition: 92/100', 'Round 1: 88/100']
      }
    }
  ]);

  // Vote history tracking
  const [voteHistory, setVoteHistory] = useState<
    { contestantId: number; contestantName: string; timestamp: string }[]
  >([]);
  const [showVoteHistory, setShowVoteHistory] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setContestants((prev) =>
        prev.map((contestant) => ({
          ...contestant,
          votes: contestant.votes + Math.floor(Math.random() * 2)
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Timer countdown

  // Phone verification process

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      {/* Alert Messages */}
      {showVoteAlert.show && (
        <Alert
          className={`${
            showVoteAlert.type === 'success'
              ? 'border-green-200 bg-green-50'
              : showVoteAlert.type === 'warning'
                ? 'border-yellow-200 bg-yellow-50'
                : showVoteAlert.type === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-blue-200 bg-blue-50'
          }`}
        >
          <AlertDescription
            className={`${
              showVoteAlert.type === 'success'
                ? 'text-green-800'
                : showVoteAlert.type === 'warning'
                  ? 'text-yellow-800'
                  : showVoteAlert.type === 'error'
                    ? 'text-red-800'
                    : 'text-blue-800'
            }`}
          >
            {showVoteAlert.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Contestants Grid */}
      <div className='grid gap-6'>
        {performances.map((performance) => (
          <Card key={performance.id} className='overflow-hidden'>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='relative'>
                <video controls className='w-full max-w-3xl rounded-lg'>
                  <source src={performance.mediaUrl} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className='p-4 md:col-span-2'>
                <CardHeader className='p-0'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-xl font-bold'>
                        {performance.artist}
                      </CardTitle>
                      <p className='text-gray-600'>{performance.songTitle}</p>
                      <p className='text-sm text-gray-500'>
                        {performance.artist} • {performance.songTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowVoteHistory(true)}
                      className='text-blue-500 hover:text-blue-600'
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className='mt-4 p-0'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='mr-4 flex items-center text-yellow-500'>
                        <Trophy size={24} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* <div className='grid gap-6'>
        {contestants.map((contestant) => (
          <Card key={contestant.id} className='overflow-hidden'>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='relative'>
                <img
                  src={contestant.performance.thumbnail}
                  alt={`${contestant.name}'s performance`}
                  className='h-full w-full object-cover'
                />
                <div className='absolute bottom-2 right-2 rounded bg-black bg-opacity-75 px-2 py-1 text-sm text-white'>
                  {contestant.performance.duration}
                </div>
                <PlayCircle className='absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-white opacity-75 hover:opacity-100' />
              </div>

              <div className='p-4 md:col-span-2'>
                <CardHeader className='p-0'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-xl font-bold'>
                        {contestant.name}
                      </CardTitle>
                      <p className='text-gray-600'>{contestant.song}</p>
                      <p className='text-sm text-gray-500'>
                        {contestant.details.city} • {contestant.details.genre} •
                        Age {contestant.details.age}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowVoteHistory(true)}
                      className='text-blue-500 hover:text-blue-600'
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className='mt-4 p-0'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='mr-4 flex items-center text-yellow-500'>
                        <Trophy size={24} />
                        <span className='ml-2 font-medium'>
                          #
                          {contestants
                            .sort((a, b) => b.votes - a.votes)
                            .findIndex((c) => c.id === contestant.id) + 1}
                        </span>
                      </div>
                      <div className='text-sm text-gray-500'>
                        {contestant.performance.views.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div> */}

      {/* Vote History Modal */}
      {showVoteHistory && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-bold'>Voting History</h3>
              <button
                onClick={() => setShowVoteHistory(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
            <div className='space-y-2'>
              {voteHistory.map((vote, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded bg-gray-50 p-2'
                >
                  <span>{vote.contestantName}</span>
                  <span className='text-sm text-gray-500'>
                    {new Date(vote.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {voteHistory.length === 0 && (
                <p className='text-center text-gray-500'>
                  No votes recorded yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingInterface;
