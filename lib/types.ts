export type UserRole = "admin" | "user";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  department: string | null;
  role: UserRole;
  tokens: number;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  department: string | null;
  challenge: string | null;
  aiTool: string | null;
  whatWeDid: string | null;
  result: string | null;
  tip: string | null;
  tags: string[];
  fileUrl: string | null;
  authorId: string;
  authorName: string | null;
  published: boolean;
  views: number;
  createdAt: string;
}

export interface Talk {
  id: string;
  title: string;
  description: string | null;
  speakerName: string;
  videoUrl: string | null;
  slidesUrl: string | null;
  duration: number | null;
  topic: string | null;
  tags: string[];
  scheduledAt: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string | null;
  articleId: string | null;
  talkId: string | null;
  createdAt: string;
}

export interface Reaction {
  id: string;
  userId: string;
  articleId: string | null;
  talkId: string | null;
  type: "like" | "insightful" | "fire";
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  explanation: string | null;
  category: string;
  active: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  userName: string | null;
  category: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number | null;
  tokensEarned: number;
  createdAt: string;
}
