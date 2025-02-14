'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Play, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PerformanceService } from '@/services/Services';
import { Performance } from '@/types/types';
import { useSearchParams } from 'next/navigation';

const getStatusColor = (status: Performance['status']) => {
  switch (status) {
    case 'approved':
      return 'text-green-500';
    case 'pending_review':
      return 'text-yellow-500';
    case 'rejected':
      return 'text-red-500';
    case 'scored':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusIcon = (status: Performance['status']) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className='h-5 w-5' />;
    case 'pending_review':
      return <Clock className='h-5 w-5' />;
    case 'rejected':
      return <X className='h-5 w-5' />;
    case 'scored':
      return <CheckCircle className='h-5 w-5' />;
  }
};

export default function PerformanceSubmission() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const contestantId = searchParams.get('contestantId');
  const roundId = searchParams.get('roundId');

  const [formData, setFormData] = useState({
    songTitle: '',
    artist: '',
    mediaType: 'video' as Performance['mediaType']
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadPerformances = async () => {
      try {
        const roundPerformances = await PerformanceService.getRoundPerformances(
          roundId!
        );
        setPerformances(roundPerformances);
      } catch (err) {
        setError('Failed to load performances');
        console.error(err);
      }
    };

    loadPerformances();
  }, [roundId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      if (files[0].size > 500 * 1024 * 1024) {
        // 500MB limit
        setError('File size exceeds 500MB limit');
        return;
      }
      setSelectedFile(files[0]);
      setError('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (
      !selectedFile ||
      !formData.songTitle.trim() ||
      !formData.artist.trim() ||
      !contestantId ||
      !roundId
    ) {
      setError('Please provide all required information');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const performanceData = {
        contestantId,
        roundId,
        slotId: '123',
        mediaType: formData.mediaType,
        songTitle: formData.songTitle.trim(),
        artist: formData.artist.trim()
      };

      await PerformanceService.submitPerformance(performanceData, selectedFile);

      // Reload performances
      const updatedPerformances = await PerformanceService.getRoundPerformances(
        roundId!
      );
      setPerformances(updatedPerformances);

      // Reset form
      setSelectedFile(null);
      setFormData({
        songTitle: '',
        artist: '',
        mediaType: 'video'
      });
      setSuccessMessage('Performance submitted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to submit performance');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlay = (mediaUrl: string) => {
    window.open(mediaUrl, '_blank');
  };

  return (
    <div className='mx-auto max-w-4xl space-y-8 p-6'>
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Performance Submissions</h1>
        <p className='text-gray-600'>
          Upload and track your competition performances
        </p>
      </div>

      {/* Upload Section */}
      <div className='mb-8 rounded-lg bg-white p-6 shadow-md'>
        {error && (
          <Alert className='mb-4 border-red-200 bg-red-50'>
            <AlertDescription className='text-red-700'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className='mb-4 border-green-200 bg-green-50'>
            <AlertDescription className='text-green-700'>
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='songTitle'
              className='block text-sm font-medium text-gray-700'
            >
              Song Title *
            </label>
            <input
              type='text'
              id='songTitle'
              name='songTitle'
              value={formData.songTitle}
              onChange={handleInputChange}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2'
              placeholder='Enter song title'
            />
          </div>

          <div>
            <label
              htmlFor='artist'
              className='block text-sm font-medium text-gray-700'
            >
              Artist *
            </label>
            <input
              type='text'
              id='artist'
              name='artist'
              value={formData.artist}
              onChange={handleInputChange}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2'
              placeholder='Enter artist name'
            />
          </div>

          <div>
            <label
              htmlFor='mediaType'
              className='block text-sm font-medium text-gray-700'
            >
              Media Type *
            </label>
            <select
              id='mediaType'
              name='mediaType'
              value={formData.mediaType}
              onChange={handleInputChange}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2'
            >
              <option value='video'>Video</option>
              <option value='audio'>Audio</option>
            </select>
          </div>
        </div>

        <div className='mt-6 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
          <input
            type='file'
            id='file-upload'
            className='hidden'
            accept={formData.mediaType === 'video' ? 'video/*' : 'audio/*'}
            onChange={handleFileChange}
          />
          <label htmlFor='file-upload' className='cursor-pointer'>
            <Upload className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='mb-2 text-lg'>
              {selectedFile
                ? selectedFile.name
                : `Drop your ${formData.mediaType} file here or click to browse`}
            </p>
            <p className='text-sm text-gray-500'>
              {formData.mediaType === 'video' ? 'MP4 or MOV' : 'MP3 or WAV'} up
              to 500MB
            </p>
          </label>
          {selectedFile && (
            <button
              className='mt-4 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Performance'}
            </button>
          )}
        </div>
      </div>

      {/* Submissions List */}
      <div className='space-y-4'>
        <h2 className='mb-4 text-xl font-semibold'>Your Submissions</h2>
        <div className='grid gap-6'>
          {performances.map((performance) => (
            <div
              key={performance.id}
              className='flex overflow-hidden rounded-lg bg-white shadow-md'
            >
              <div className='flex h-32 w-48 items-center justify-center bg-gray-100'>
                {performance.mediaType === 'video' ? (
                  <Play className='h-12 w-12 text-gray-400' />
                ) : (
                  <Upload className='h-12 w-12 text-gray-400' />
                )}
              </div>
              <div className='flex flex-1 items-center justify-between p-4'>
                <div>
                  <h3 className='mb-1 text-lg font-semibold'>
                    {performance.songTitle}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    Artist: {performance.artist}
                  </p>
                  <p className='text-sm text-gray-500'>
                    Submitted:{' '}
                    {new Date(performance.submittedAt).toLocaleDateString()}
                  </p>
                  {performance.notes && (
                    <p className='mt-2 text-sm text-gray-600'>
                      Notes: {performance.notes}
                    </p>
                  )}
                </div>
                <div className='flex items-center space-x-2'>
                  <span
                    className={`flex items-center ${getStatusColor(performance.status)}`}
                  >
                    {getStatusIcon(performance.status)}
                    <span className='ml-2 capitalize'>
                      {performance.status.replace('_', ' ')}
                    </span>
                  </span>
                  {(performance.status === 'approved' ||
                    performance.status === 'scored') && (
                    <button
                      className='ml-4 rounded-full p-2 hover:bg-gray-100'
                      onClick={() => handlePlay(performance.mediaUrl)}
                    >
                      <Play className='h-5 w-5' />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
