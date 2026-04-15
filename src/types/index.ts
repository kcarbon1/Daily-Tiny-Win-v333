export interface Task {
  id: string;
  title: string;
  category: 'health' | 'mindset' | 'social' | 'productivity';
  points: number;
  completed: boolean;
  icon: string;
}

export interface GardenState {
  level: number;
  experience: number;
  plants: Plant[];
}

export interface Plant {
  id: string;
  type: 'flower' | 'tree' | 'shrub';
  stage: number; // 0 to 3
  position: { x: number; y: number };
}

export interface DailyStats {
  date: string;
  completedCount: number;
  totalCount: number;
}
