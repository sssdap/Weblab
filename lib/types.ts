// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
}

// Course types
export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  isLocked: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "theory" | "practice";
  duration: string;
  completed: boolean;
}

// Chapter/Lesson detail
export interface ChapterContent {
  id: string;
  moduleId: string;
  title: string;
  videoUrl?: string;
  theory: string;
  codeExamples: CodeExample[];
  hasTest: boolean;
}

export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
}

// Quiz types
export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctAnswerId: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: Date;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

// Project submission types
export interface ProjectSubmission {
  id: string;
  userId: string;
  moduleId: string;
  githubUrl: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "needs_revision";
  grade?: number;
  feedback?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Progress types
export interface UserProgress {
  userId: string;
  completedModules: string[];
  completedLessons: string[];
  currentModuleId: string;
  currentLessonId: string;
  overallProgress: number;
  testScores: TestScore[];
  lastActivity: Date;
}

export interface TestScore {
  moduleId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
}

// Activity feed
export interface Activity {
  id: string;
  userId: string;
  type: "lesson_completed" | "test_passed" | "test_failed" | "project_submitted" | "project_approved" | "project_rejected";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
}

// Admin stats
export interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  averageTestScore: number;
  pendingSubmissions: number;
  completionRate: number;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  progress: number;
  averageTestScore: number;
  submissionsCount: number;
  lastActive: Date;
  status: "active" | "inactive" | "completed";
}

// FAQ type
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Feature type for landing page
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}
