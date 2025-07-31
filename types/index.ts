export interface Course {
  id: string;
  name: string;
  courseId: string;
  totalHours: number;
  presentHours: number;
  color: string;
  createdAt: Date;
}

export interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  courseName: string;
  courseId: string;
  location?: string;
  duration: number;
}

export interface AttendanceRecord {
  courseId: string;
  date: string;
  status: 'present' | 'absent';
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const COURSE_COLORS = [
  '#2563EB', '#059669', '#DC2626', '#7C3AED', '#EA580C', '#0891B2', '#BE185D', '#4338CA'
];