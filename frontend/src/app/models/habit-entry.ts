export interface HabitEntry {
  _id: string;
  habitId: string;
  date: string;
  status: 'planned' | 'completed' | 'missed' | 'occurred';
}
