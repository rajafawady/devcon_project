'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseAuth } from '@/lib/firebase/config';
// import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { RoundService, ContestantService } from '@/services/Services';
import { MultiSelect } from '@/components/ui/multi-select';

// Firestore reference
const db = getFirestore();

const roundSchema = z.object({
  name: z.string().min(3, 'Round name is required'),
  description: z.string().optional(),
  maxContestants: z.number().min(1, 'Must allow at least one contestant'),
  votingEnabled: z.boolean(),
  assignedContestants: z.array(z.string())
});

type RoundFormData = z.infer<typeof roundSchema>;

export default function CompetitionRoundForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RoundFormData>({
    resolver: zodResolver(roundSchema)
  });

  const [loading, setLoading] = useState(false);
  const [contestants, setContestants] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    async function fetchContestants() {
      const contestants = await ContestantService.getContestants();
      setContestants(contestants.map((c) => ({ id: c.id, name: c.name })));
    }
    fetchContestants();
  }, []);
  const onSubmit = async (data: RoundFormData) => {
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Prepare round data
      const roundData = {
        ...data,
        createdAt: new Date(),
        createdBy: user.uid,
        status: 'upcoming',
        judgeIds: []
      };

      await RoundService.createRound(roundData as any);
      toast.success('Competition round created successfully!');
    } catch (error: any) {
      toast.error('Error creating round: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6'>
      <h2 className='mb-4 text-xl font-bold'>Create Competition Round</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input placeholder='Round Name' {...register('name')} />
        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}

        <Textarea
          placeholder='Description (optional)'
          {...register('description')}
        />

        <MultiSelect
          options={contestants}
          selected={watch('assignedContestants') || []}
          onChange={(selected) => setValue('assignedContestants', selected)}
          placeholder='Select Contestants'
        />
        {errors.assignedContestants && (
          <p className='text-red-500'>{errors.assignedContestants.message}</p>
        )}

        <Input
          type='number'
          placeholder='Max Contestants'
          {...register('maxContestants', { valueAsNumber: true })}
        />
        {errors.maxContestants && (
          <p className='text-red-500'>{errors.maxContestants.message}</p>
        )}

        {/* assign contestants */}

        <div className='flex items-center space-x-2'>
          <input type='checkbox' {...register('votingEnabled')} />
          <label>Enable Voting</label>
        </div>

        <Button type='submit' disabled={loading}>
          {loading ? 'Creating...' : 'Create Round'}
        </Button>
      </form>
    </div>
  );
}
