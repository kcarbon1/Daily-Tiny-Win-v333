import { Task } from '../types';

export const DAILY_TASKS_POOL: Omit<Task, 'completed'>[] = [
  { id: '1', title: 'Drink a glass of water', category: 'health', points: 10, icon: 'Droplets' },
  { id: '2', title: '10 squats', category: 'health', points: 15, icon: 'Activity' },
  { id: '3', title: 'Write a compliment to someone', category: 'social', points: 20, icon: 'Heart' },
  { id: '4', title: '5 minutes of meditation', category: 'mindset', points: 15, icon: 'Wind' },
  { id: '5', title: 'Plan your next day', category: 'productivity', points: 10, icon: 'Calendar' },
  { id: '6', title: 'Read 5 pages of a book', category: 'mindset', points: 15, icon: 'BookOpen' },
  { id: '7', title: 'Stretch for 2 minutes', category: 'health', points: 10, icon: 'Move' },
  { id: '8', title: 'Deep breath (3 times)', category: 'mindset', points: 5, icon: 'Cloud' },
  { id: '9', title: 'Clean your desk', category: 'productivity', points: 15, icon: 'Layout' },
  { id: '10', title: 'Call a friend', category: 'social', points: 20, icon: 'Phone' },
];

export const getDailyTasks = (dateSeed: string): Task[] => {
  // Simple deterministic shuffle based on date
  const seed = dateSeed.split('-').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...DAILY_TASKS_POOL].sort(() => (seed % 10) - 5);
  return shuffled.slice(0, 4).map(t => ({ ...t, completed: false }));
};
