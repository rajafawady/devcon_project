'use client';
import React, { useState, useEffect } from 'react';
import { ContestantService } from '@/services/Services';
import type { User, Contestant, Performance } from '@/types/types';
import { PerformanceService } from '@/services/Services';

interface Props {
  user: User;
}

export const ContestantProfileManager: React.FC<Props> = ({ user }) => {
  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContestantData();
  }, [user.id]);

  const loadContestantData = async () => {
    try {
      setLoading(true);
      const contestantData = await ContestantService.getContestant(user.id);
      if (contestantData) {
        setContestant(contestantData);
        // Load contestant's performances
        const allPerformances = await Promise.all(
          contestantData.songPreferences.map(async (songId) => {
            const perf = await PerformanceService.getPerformance(songId);
            return perf;
          })
        );
        setPerformances(
          allPerformances.filter((p): p is Performance => p !== null)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: Partial<Contestant>) => {
    try {
      if (!contestant) return;
      await ContestantService.updateProfile(contestant.id, updates);
      await loadContestantData(); // Reload data after update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) return <div className='p-4'>Loading profile...</div>;
  if (error) return <div className='p-4 text-red-600'>Error: {error}</div>;
  if (!contestant) return <div className='p-4'>No profile found</div>;

  return (
    <div className='mx-auto max-w-4xl space-y-8 p-4'>
      <ProfileForm contestant={contestant} onSubmit={handleProfileUpdate} />
      <PerformanceHistory performances={performances} />
      <SongPreferences
        preferences={contestant.songPreferences}
        onUpdate={(newPreferences) =>
          handleProfileUpdate({ songPreferences: newPreferences })
        }
      />
    </div>
  );
};

// src/components/profile/ProfileForm.tsx
interface ProfileFormProps {
  contestant: Contestant;
  onSubmit: (updates: Partial<Contestant>) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ contestant, onSubmit }) => {
  const [formData, setFormData] = useState(contestant);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label className='block text-sm font-medium'>Name</label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        />
      </div>

      <div>
        <label className='block text-sm font-medium'>Biography</label>
        <textarea
          value={formData.profile.bio || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              profile: { ...formData.profile, bio: e.target.value }
            })
          }
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          rows={4}
        />
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Social Links</h3>
        {(['youtube', 'instagram', 'twitter'] as const).map((platform) => (
          <div key={platform}>
            <label className='block text-sm font-medium capitalize'>
              {platform}
            </label>
            <input
              type='url'
              value={
                formData.profile.socialLinks?.[
                  platform as 'youtube' | 'instagram' | 'twitter'
                ] || ''
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: {
                    ...formData.profile,
                    socialLinks: {
                      ...formData.profile.socialLinks,
                      [platform]: e.target.value
                    }
                  }
                })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
          </div>
        ))}
      </div>

      <button
        type='submit'
        className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700'
      >
        Save Profile
      </button>
    </form>
  );
};

// src/components/profile/PerformanceHistory.tsx
interface PerformanceHistoryProps {
  performances: Performance[];
}

const PerformanceHistory: React.FC<PerformanceHistoryProps> = ({
  performances
}) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Performance History</h2>
      <div className='space-y-4'>
        {performances.map((performance) => (
          <div
            key={performance.id}
            className='space-y-2 rounded-lg border p-4 shadow-sm'
          >
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>
                {performance.songTitle} - {performance.artist}
              </h3>
              <span
                className={`rounded-full px-2 py-1 text-sm ${
                  performance.status === 'scored'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {performance.status}
              </span>
            </div>
            <p className='text-sm text-gray-600'>
              Submitted: {performance.submittedAt.toLocaleDateString()}
            </p>
            {performance.notes && (
              <p className='text-sm text-gray-600'>
                Notes: {performance.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// src/components/profile/SongPreferences.tsx
interface SongPreferencesProps {
  preferences: string[];
  onUpdate: (newPreferences: string[]) => Promise<void>;
}

const SongPreferences: React.FC<SongPreferencesProps> = ({
  preferences,
  onUpdate
}) => {
  const [newSong, setNewSong] = useState('');

  const handleAdd = async () => {
    if (!newSong.trim()) return;
    await onUpdate([...preferences, newSong]);
    setNewSong('');
  };

  const handleRemove = async (songToRemove: string) => {
    await onUpdate(preferences.filter((song) => song !== songToRemove));
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Song Preferences</h2>
      <div className='flex gap-2'>
        <input
          type='text'
          value={newSong}
          onChange={(e) => setNewSong(e.target.value)}
          placeholder='Add new song preference'
          className='flex-1 rounded-md border-gray-300 shadow-sm'
        />
        <button
          onClick={handleAdd}
          className='rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
        >
          Add
        </button>
      </div>
      <ul className='space-y-2'>
        {preferences.map((song, index) => (
          <li
            key={index}
            className='flex items-center justify-between rounded-md bg-gray-50 p-2'
          >
            <span>{song}</span>
            <button
              onClick={() => handleRemove(song)}
              className='text-red-600 hover:text-red-800'
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContestantProfileManager;
