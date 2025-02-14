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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VotingInterface = () => {
  // Simulated user authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  // Competition state
  const [votingOpen, setVotingOpen] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [showVoteAlert, setShowVoteAlert] = useState({
    show: false,
    message: '',
    type: ''
  });

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
    },
    {
      id: 2,
      name: 'Michael Chen',
      song: 'Perfect',
      votes: 982,
      hasVoted: false,
      performance: {
        thumbnail: '/api/placeholder/320/180',
        duration: '4:12',
        uploadDate: '2024-02-14',
        views: 1876
      },
      details: {
        city: 'San Francisco',
        age: 25,
        genre: 'R&B',
        previousRounds: ['Audition: 89/100', 'Round 1: 91/100']
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
  useEffect(() => {
    if (timeRemaining > 0 && votingOpen) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setVotingOpen(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, votingOpen]);

  // Phone verification process
  const handlePhoneSubmit = () => {
    if (userPhone.length >= 10) {
      // Simulate SMS verification code send
      setShowVerification(true);
      setShowVoteAlert({
        show: true,
        message: 'Verification code sent to your phone!',
        type: 'info'
      });
      setTimeout(
        () => setShowVoteAlert({ show: false, message: '', type: '' }),
        3000
      );
    }
  };

  const handleVerificationSubmit = () => {
    if (verificationCode.length === 6) {
      setIsAuthenticated(true);
      setShowVerification(false);
      setShowVoteAlert({
        show: true,
        message: 'Phone verified successfully! You can now vote.',
        type: 'success'
      });
      setTimeout(
        () => setShowVoteAlert({ show: false, message: '', type: '' }),
        3000
      );
    }
  };

  const handleVote = (contestantId: number) => {
    if (!isAuthenticated) {
      setShowVoteAlert({
        show: true,
        message: 'Please verify your phone number to vote',
        type: 'warning'
      });
      return;
    }

    if (!votingOpen) {
      setShowVoteAlert({
        show: true,
        message: 'Voting is now closed',
        type: 'error'
      });
      return;
    }

    setContestants(
      contestants.map((contestant) => {
        if (contestant.id === contestantId && !contestant.hasVoted) {
          // Record vote in history
          setVoteHistory(
            (
              prev: {
                contestantId: number;
                contestantName: string;
                timestamp: string;
              }[]
            ) => [
              ...prev,
              {
                contestantId,
                contestantName: contestant.name,
                timestamp: new Date().toISOString()
              }
            ]
          );

          return {
            ...contestant,
            votes: contestant.votes + 1,
            hasVoted: true
          };
        }
        return contestant;
      })
    );

    setShowVoteAlert({
      show: true,
      message: 'Thank you for voting! Your vote has been recorded.',
      type: 'success'
    });
    setTimeout(
      () => setShowVoteAlert({ show: false, message: '', type: '' }),
      3000
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      {/* Voting Status Bar */}
      <div className='flex items-center justify-between rounded-lg bg-white p-4 shadow'>
        <div className='flex items-center space-x-4'>
          <Clock className='text-blue-500' />
          <div>
            <p className='font-medium'>
              Voting {votingOpen ? 'Open' : 'Closed'}
            </p>
            <p className='text-sm text-gray-500'>
              Time Remaining: {formatTime(timeRemaining)}
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <div className='flex items-center space-x-4'>
            <User className='text-gray-500' />
            <button
              onClick={() => setShowVerification(true)}
              className='rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Verify to Vote
            </button>
          </div>
        )}
      </div>

      {/* Phone Verification Modal */}
      {showVerification && !isAuthenticated && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6'>
            <h3 className='mb-4 text-xl font-bold'>Phone Verification</h3>
            {!showVerification ? (
              <div className='space-y-4'>
                <input
                  type='tel'
                  placeholder='Enter phone number'
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className='w-full rounded border p-2'
                />
                <button
                  onClick={handlePhoneSubmit}
                  className='w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600'
                >
                  Send Code
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                <input
                  type='text'
                  placeholder='Enter verification code'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className='w-full rounded border p-2'
                />
                <button
                  onClick={handleVerificationSubmit}
                  className='w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600'
                >
                  Verify Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                    <div className='flex items-center space-x-4'>
                      <button
                        onClick={() => handleVote(contestant.id)}
                        disabled={
                          contestant.hasVoted || !votingOpen || !isAuthenticated
                        }
                        className={`flex items-center space-x-2 rounded-full px-4 py-2 ${
                          !votingOpen
                            ? 'bg-gray-100 text-gray-500'
                            : contestant.hasVoted
                              ? 'bg-green-100 text-green-500'
                              : !isAuthenticated
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        {!isAuthenticated ? (
                          <Lock size={20} />
                        ) : (
                          <Heart
                            className={
                              contestant.hasVoted ? 'fill-current' : ''
                            }
                            size={20}
                          />
                        )}
                        <span className='font-medium'>
                          {contestant.votes.toLocaleString()}
                        </span>
                      </button>

                      <button className='flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2 text-blue-500 hover:bg-blue-100'>
                        <Share2 size={20} />
                        <span className='font-medium'>Share</span>
                      </button>
                    </div>

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

                  <div className='mt-4 text-sm text-gray-600'>
                    <p>Previous Rounds:</p>
                    <div className='mt-1 flex space-x-4'>
                      {contestant.details.previousRounds.map((round, index) => (
                        <span
                          key={index}
                          className='rounded bg-gray-100 px-2 py-1'
                        >
                          {round}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
