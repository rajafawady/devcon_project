'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

type Contestant = {
  id: string;
  name: string;
  performance: string;
  scores: {
    pitch: number;
    tone: number;
    stagePresence: number;
  };
  totalScore: number;
};

const JudgeScoringPanel = () => {
  // State for current contestant being scored
  const [currentScores, setCurrentScores] = useState({
    pitch: 0,
    tone: 0,
    stagePresence: 0
  });

  // Mock contestants data - in real app would come from props/API
  const [contestants, setContestants] = useState<Contestant[]>([
    {
      id: '1',
      name: 'John Doe',
      performance: 'Song A',
      scores: { pitch: 0, tone: 0, stagePresence: 0 },
      totalScore: 0
    },
    {
      id: '2',
      name: 'Jane Smith',
      performance: 'Song B',
      scores: { pitch: 0, tone: 0, stagePresence: 0 },
      totalScore: 0
    }
  ]);

  const handleScoreSubmit = (contestantId: string) => {
    setContestants((prev) =>
      prev.map((contestant) => {
        if (contestant.id === contestantId) {
          const totalScore =
            (currentScores.pitch +
              currentScores.tone +
              currentScores.stagePresence) /
            3;
          return {
            ...contestant,
            scores: currentScores,
            totalScore
          };
        }
        return contestant;
      })
    );

    // Reset current scores
    setCurrentScores({ pitch: 0, tone: 0, stagePresence: 0 });
  };

  return (
    <div className='space-y-8'>
      {/* Scoring Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Scoring</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Pitch (0-10)
              </label>
              <Slider
                defaultValue={[0]}
                max={10}
                step={0.5}
                onValueChange={(value) =>
                  setCurrentScores((prev) => ({ ...prev, pitch: value[0] }))
                }
              />
              <span className='text-sm text-gray-500'>
                {currentScores.pitch}
              </span>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium'>
                Tone (0-10)
              </label>
              <Slider
                defaultValue={[0]}
                max={10}
                step={0.5}
                onValueChange={(value) =>
                  setCurrentScores((prev) => ({ ...prev, tone: value[0] }))
                }
              />
              <span className='text-sm text-gray-500'>
                {currentScores.tone}
              </span>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium'>
                Stage Presence (0-10)
              </label>
              <Slider
                defaultValue={[0]}
                max={10}
                step={0.5}
                onValueChange={(value) =>
                  setCurrentScores((prev) => ({
                    ...prev,
                    stagePresence: value[0]
                  }))
                }
              />
              <span className='text-sm text-gray-500'>
                {currentScores.stagePresence}
              </span>
            </div>

            <Button
              className='mt-4 w-full'
              onClick={() => handleScoreSubmit('1')}
            >
              Submit Scores
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Contestant Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Contestant</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Pitch</TableHead>
                <TableHead>Tone</TableHead>
                <TableHead>Stage Presence</TableHead>
                <TableHead>Total Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contestants
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((contestant, index) => (
                  <TableRow key={contestant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{contestant.name}</TableCell>
                    <TableCell>{contestant.performance}</TableCell>
                    <TableCell>{contestant.scores.pitch}</TableCell>
                    <TableCell>{contestant.scores.tone}</TableCell>
                    <TableCell>{contestant.scores.stagePresence}</TableCell>
                    <TableCell>{contestant.totalScore.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgeScoringPanel;
