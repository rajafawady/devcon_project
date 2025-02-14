export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'contestant' | 'judge' | 'user';
  createdAt: Date;
  lastLogin: Date;
}

export interface Contestant {
  id: string;
  userId: string;
  name: string;
  email: string;
  songPreferences: string[];
  profile: {
    bio?: string;
    socialLinks?: {
      youtube?: string;
      instagram?: string;
      twitter?: string;
    };
  };
  createdAt: Date;
}

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

export interface Performance {
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

export interface Score {
  id: string;
  performanceId: string;
  judgeId: string;
  criteria: {
    pitch: number;
    tone: number;
    stagePresence: number;
    overall: number;
  };
  comments?: string;
  submittedAt: Date;
}

export interface Vote {
  id: string;
  performanceId: string;
  voterId: string;
  timestamp: Date;
}

export interface PerformanceSlot {
  id: string;
  roundId: string;
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked' | 'completed';
  contestantId?: string;
}

export interface PitchAnalysis {
  id: string;
  performanceId: string;
  accuracy: number;
  notes: Array<{
    timestamp: number;
    expectedNote: string;
    actualNote: string;
    accuracy: number;
  }>;
  overallScore: number;
  createdAt: Date;
}

export interface RoundResult {
  id: string;
  roundId: string;
  results: Array<{
    rank: number;
    contestantId: string;
    performanceId: string;
    finalScore: number;
    judgeScore: number;
    audienceScore: number;
    pitchAccuracy?: number;
  }>;
  generatedAt: Date;
}
