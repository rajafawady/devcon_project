// src/lib/services/competitionService.ts
import { where, serverTimestamp } from 'firebase/firestore';
import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument
} from '@/lib/firebase/db';
import { uploadFile } from '@/lib/firebase/storage';
import type {
  Contestant,
  Round,
  Performance,
  Score,
  Vote,
  PerformanceSlot,
  RoundResult
} from '@/types/types';

// Contestant Management
export const ContestantService = {
  async register(data: Omit<Contestant, 'id' | 'createdAt'>): Promise<string> {
    return addDocument('contestants', {
      ...data,
      createdAt: serverTimestamp()
    });
  },

  async getContestant(id: string): Promise<Contestant | null> {
    const data = await getDocument('contestants', id);
    return data ? (data as Contestant) : null;
  },

  async updateProfile(id: string, data: Partial<Contestant>): Promise<void> {
    return updateDocument('contestants', id, data);
  },

  async getContestantsByRound(roundId: string): Promise<Contestant[]> {
    const performances = await getCollection('performances', [
      where('roundId', '==', roundId)
    ]);

    // Assuming performances are of type 'Performance' that includes contestantId
    const contestantIds = Array.from(
      new Set(performances.map((p: Performance) => p.contestantId))
    );

    // Fetch contestants using the unique contestant IDs
    const contestants = await Promise.all(
      contestantIds.map((id) => this.getContestant(id))
    );

    // Filter out null values and return the valid contestants
    return contestants.filter((c): c is Contestant => c !== null);
  }
};

// Round Management
export const RoundService = {
  async createRound(data: Omit<Round, 'id' | 'createdAt'>): Promise<string> {
    return addDocument('rounds', {
      ...data,
      createdAt: serverTimestamp()
    });
  },

  async getRound(id: string): Promise<Round | null> {
    const doc = await getDocument('rounds', id);
    return doc ? (doc as Round) : null;
  },

  async updateRound(id: string, data: Partial<Round>): Promise<void> {
    return updateDocument('rounds', id, data);
  },

  async createPerformanceSlots(
    roundId: string,
    slots: Omit<PerformanceSlot, 'id' | 'roundId'>[]
  ): Promise<string[]> {
    const slotPromises = slots.map((slot) =>
      addDocument('performanceSlots', {
        ...slot,
        roundId,
        status: 'available'
      })
    );
    return Promise.all(slotPromises);
  },

  async getAvailableSlots(roundId: string): Promise<PerformanceSlot[]> {
    return getCollection('performanceSlots', [
      where('roundId', '==', roundId),
      where('status', '==', 'available')
    ]) as unknown as PerformanceSlot[];
  }
};

// Performance Management
export const PerformanceService = {
  async submitPerformance(
    data: Omit<Performance, 'id' | 'submittedAt' | 'status' | 'mediaUrl'>,
    mediaFile: File
  ): Promise<string> {
    // Upload media file
    const mediaUrl = await uploadFile(
      `performances/${data.contestantId}/${Date.now()}_${mediaFile.name}`,
      mediaFile
    );

    // Create performance record
    return addDocument('performances', {
      ...data,
      mediaUrl,
      status: 'pending_review',
      submittedAt: serverTimestamp()
    });
  },

  async updateStatus(
    id: string,
    status: Performance['status'],
    notes?: string
  ): Promise<void> {
    return updateDocument('performances', id, { status, notes });
  },

  async getPerformance(id: string): Promise<Performance | null> {
    const doc = await getDocument('performances', id);
    return doc ? (doc as Performance) : null;
  },

  async getRoundPerformances(roundId: string): Promise<Performance[]> {
    const docs = await getCollection('performances', [
      where('roundId', '==', roundId)
    ]);
    return docs.map((doc) => doc as Performance);
  }
};

// Scoring System
export const ScoringService = {
  async submitScore(data: Omit<Score, 'id' | 'submittedAt'>): Promise<string> {
    const scoreId = await addDocument('scores', {
      ...data,
      submittedAt: serverTimestamp()
    });

    await PerformanceService.updateStatus(data.performanceId, 'scored');
    return scoreId;
  },

  async getPerformanceScores(performanceId: string): Promise<Score[]> {
    const docs = await getCollection('scores', [
      where('performanceId', '==', performanceId)
    ]);
    return docs.map((doc) => doc as Score);
  },

  async calculateAverageScore(performanceId: string): Promise<number> {
    const scores = await this.getPerformanceScores(performanceId);
    return (
      scores.reduce((sum, score) => sum + score.criteria.overall, 0) /
      scores.length
    );
  }
};

// Voting System
export const VotingService = {
  async submitVote(data: Omit<Vote, 'id' | 'timestamp'>): Promise<string> {
    // Check for existing vote
    const existingVotes = await getCollection('votes', [
      where('voterId', '==', data.voterId),
      where('performanceId', '==', data.performanceId)
    ]);

    if (existingVotes.length > 0) {
      throw new Error('User has already voted for this performance');
    }

    return addDocument('votes', {
      ...data,
      timestamp: serverTimestamp()
    });
  },

  async getVoteCount(performanceId: string): Promise<number> {
    const votes = await getCollection('votes', [
      where('performanceId', '==', performanceId)
    ]);
    return votes.length;
  }
};

// Results Management
export const ResultsService = {
  async generateResults(roundId: string): Promise<string> {
    const performances = await PerformanceService.getRoundPerformances(roundId);

    if (performances.length === 0) {
      throw new Error('No performances found for this round');
    }

    // Calculate scores and votes
    const performanceResults = await Promise.all(
      performances.map(async (performance) => {
        const averageScore = await ScoringService.calculateAverageScore(
          performance.id
        );
        const voteCount = await VotingService.getVoteCount(performance.id);

        return {
          performanceId: performance.id,
          contestantId: performance.contestantId,
          finalScore: averageScore + voteCount,
          judgeScore: averageScore,
          audienceScore: voteCount,
          rank: 0
        };
      })
    );

    // Sort by finalScore in descending order
    performanceResults.sort((a, b) => b.finalScore - a.finalScore);

    // Assign rankings
    performanceResults.forEach((result, index) => {
      result.rank = index + 1; // Rank starts from 1
    });

    // Create the RoundResult object
    const roundResult: RoundResult = {
      id: '', // You will generate this when adding to the database
      roundId,
      results: performanceResults, // This is the results array
      generatedAt: new Date() // You can adjust the date as needed
    };

    // Store the results in the database
    const resultId = await addDocument('roundResults', roundResult);

    return resultId;
  },

  async getRoundResults(roundId: string): Promise<RoundResult[] | null> {
    const roundResults = await getCollection('roundResults', [
      where('roundId', '==', roundId)
    ]);

    return roundResults.map((doc) => doc as RoundResult);
  }
};
