'use client';
import React, { useState } from 'react';
import { Upload, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const dummyPerformances = [
  {
    id: 1,
    title: "Can't Help Falling in Love",
    submittedAt: '2024-02-14T15:30:00',
    deadline: '2024-02-15T23:59:59',
    status: 'approved',
    mediaType: 'video',
    thumbnailUrl: '/api/placeholder/320/180'
  },
  {
    id: 2,
    title: 'Perfect',
    submittedAt: '2024-02-13T10:15:00',
    deadline: '2024-02-15T23:59:59',
    status: 'pending_review',
    mediaType: 'video',
    thumbnailUrl: '/api/placeholder/320/180'
  },
  {
    id: 3,
    title: 'All of Me',
    submittedAt: null,
    deadline: '2024-02-16T23:59:59',
    status: 'not_submitted',
    mediaType: 'video',
    thumbnailUrl: '/api/placeholder/320/180'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-green-500';
    case 'pending_review':
      return 'text-yellow-500';
    case 'rejected':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className='h-5 w-5' />;
    case 'pending_review':
      return <Clock className='h-5 w-5' />;
    case 'rejected':
      return <AlertCircle className='h-5 w-5' />;
    default:
      return <Upload className='h-5 w-5' />;
  }
};

export default function PerformanceSubmission() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
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
        <div className='rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
          <input
            type='file'
            id='file-upload'
            className='hidden'
            accept='video/*'
            onChange={handleFileChange}
          />
          <label htmlFor='file-upload' className='cursor-pointer'>
            <Upload className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='mb-2 text-lg'>
              {selectedFile
                ? selectedFile.name
                : 'Drop your video file here or click to browse'}
            </p>
            <p className='text-sm text-gray-500'>MP4 or MOV up to 500MB</p>
          </label>
          {selectedFile && (
            <button className='mt-4 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
              Submit Performance
            </button>
          )}
        </div>
      </div>

      {/* Deadline Alert */}
      <Alert className='mb-6 border-yellow-200 bg-yellow-50'>
        <AlertDescription>
          Next submission deadline: February 15, 2024, 11:59 PM
        </AlertDescription>
      </Alert>

      {/* Submissions List */}
      <div className='space-y-4'>
        <h2 className='mb-4 text-xl font-semibold'>Your Submissions</h2>
        <div className='grid gap-6'>
          {dummyPerformances.map((performance) => (
            <div
              key={performance.id}
              className='flex overflow-hidden rounded-lg bg-white shadow-md'
            >
              <img
                src={performance.thumbnailUrl}
                alt={performance.title}
                className='h-32 w-48 object-cover'
              />
              <div className='flex flex-1 items-center justify-between p-4'>
                <div>
                  <h3 className='mb-1 text-lg font-semibold'>
                    {performance.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {performance.submittedAt
                      ? `Submitted: ${new Date(performance.submittedAt).toLocaleDateString()}`
                      : 'Not submitted yet'}
                  </p>
                  <p className='text-sm text-gray-500'>
                    Deadline:{' '}
                    {new Date(performance.deadline).toLocaleDateString()}
                  </p>
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
                  {performance.status === 'approved' && (
                    <button className='ml-4 rounded-full p-2 hover:bg-gray-100'>
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
