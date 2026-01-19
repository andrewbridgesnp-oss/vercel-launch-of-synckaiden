import { invokeLLM } from '../_core/llm';

export interface Competition {
  id: number;
  title: string;
  description: string;
  category: 'art' | 'music' | 'writing' | 'video';
  startTime: Date;
  endTime: Date;
  prizePool: number;
  participantCount: number;
  status: 'upcoming' | 'live' | 'judging' | 'completed';
}

export interface Submission {
  id: number;
  competitionId: number;
  userId: number;
  title: string;
  fileUrl: string;
  votes: number;
  score: number;
  submittedAt: Date;
}

export interface Leaderboard {
  userId: number;
  username: string;
  totalWins: number;
  totalSubmissions: number;
  averageScore: number;
  rank: number;
}

export async function getCompetitions(): Promise<Competition[]> {
  return [
    {
      id: 1,
      title: 'Digital Art Showdown',
      description: 'Create stunning digital artwork',
      category: 'art',
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 7200000),
      prizePool: 1000,
      participantCount: 45,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Beat Battle',
      description: 'Produce the best beat',
      category: 'music',
      startTime: new Date(Date.now() - 1800000),
      endTime: new Date(Date.now() + 1800000),
      prizePool: 500,
      participantCount: 32,
      status: 'live',
    },
  ];
}

export async function getSubmissions(competitionId: number): Promise<Submission[]> {
  return [
    {
      id: 1,
      competitionId,
      userId: 1,
      title: 'Sunset Dreams',
      fileUrl: '/submissions/art1.jpg',
      votes: 125,
      score: 8.5,
      submittedAt: new Date(),
    },
    {
      id: 2,
      competitionId,
      userId: 2,
      title: 'Urban Vibes',
      fileUrl: '/submissions/art2.jpg',
      votes: 98,
      score: 7.8,
      submittedAt: new Date(),
    },
  ];
}

export async function submitEntry(params: {
  userId: number;
  competitionId: number;
  title: string;
  fileUrl: string;
}): Promise<Submission> {
  return {
    id: Date.now(),
    competitionId: params.competitionId,
    userId: params.userId,
    title: params.title,
    fileUrl: params.fileUrl,
    votes: 0,
    score: 0,
    submittedAt: new Date(),
  };
}

export async function voteForSubmission(submissionId: number): Promise<{ success: boolean; newVoteCount: number }> {
  return {
    success: true,
    newVoteCount: 126,
  };
}

export async function getLeaderboard(): Promise<Leaderboard[]> {
  return [
    { userId: 1, username: 'ArtMaster99', totalWins: 12, totalSubmissions: 45, averageScore: 8.2, rank: 1 },
    { userId: 2, username: 'CreativeGenius', totalWins: 10, totalSubmissions: 38, averageScore: 7.9, rank: 2 },
    { userId: 3, username: 'PixelPro', totalWins: 8, totalSubmissions: 42, averageScore: 7.5, rank: 3 },
  ];
}

export async function judgeSubmission(params: {
  submissionId: number;
  criteria: string[];
}): Promise<{ score: number; feedback: string }> {
  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are an expert creative judge. Provide constructive feedback and a score out of 10.',
      },
      {
        role: 'user',
        content: `Judge this submission based on: ${params.criteria.join(', ')}. Provide score and feedback.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || '';
  const feedback = typeof content === 'string' ? content : 'Judging feedback unavailable';

  return {
    score: 8.5,
    feedback,
  };
}
