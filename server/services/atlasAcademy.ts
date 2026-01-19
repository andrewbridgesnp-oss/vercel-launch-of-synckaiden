import { invokeLLM } from '../_core/llm';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrollmentCount: number;
  rating: number;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  completedAt?: Date;
  enrolledAt: Date;
}

export async function getCourses(): Promise<Course[]> {
  return [
    { id: 1, title: 'AI Fundamentals', description: 'Learn AI basics', instructor: 'Dr. Smith', duration: 40, level: 'beginner', enrollmentCount: 1250, rating: 4.8 },
    { id: 2, title: 'Advanced Machine Learning', description: 'Deep dive into ML', instructor: 'Prof. Johnson', duration: 60, level: 'advanced', enrollmentCount: 850, rating: 4.9 },
    { id: 3, title: 'Business Strategy', description: 'Strategic planning', instructor: 'MBA Expert', duration: 30, level: 'intermediate', enrollmentCount: 2100, rating: 4.7 },
  ];
}

export async function enrollInCourse(userId: number, courseId: number): Promise<Enrollment> {
  return {
    id: Date.now(),
    userId,
    courseId,
    progress: 0,
    enrolledAt: new Date(),
  };
}

export async function getEnrollments(userId: number): Promise<Enrollment[]> {
  return [
    { id: 1, userId, courseId: 1, progress: 45, enrolledAt: new Date(Date.now() - 604800000) },
    { id: 2, userId, courseId: 3, progress: 100, completedAt: new Date(), enrolledAt: new Date(Date.now() - 1209600000) },
  ];
}

export async function updateProgress(enrollmentId: number, progress: number): Promise<Enrollment> {
  return {
    id: enrollmentId,
    userId: 1,
    courseId: 1,
    progress,
    enrolledAt: new Date(),
  };
}

export async function getCourseRecommendations(userId: number): Promise<{ courses: Course[]; reason: string }[]> {
  const courses = await getCourses();
  return courses.slice(0, 3).map(course => ({
    courses: [course],
    reason: `Based on your interests in ${course.level} level content`,
  }));
}
