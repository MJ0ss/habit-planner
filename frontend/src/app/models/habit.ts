export interface Habit {
  _id: string;
  name: string;
  type: 'positive' | 'negative';
}