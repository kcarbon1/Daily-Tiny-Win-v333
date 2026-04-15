/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Garden } from './components/Garden';
import { TaskList } from './components/TaskList';
import { BaseCheckIn } from './components/BaseCheckIn';
import { Web3Provider } from './components/Web3Provider';
import { getDailyTasks } from './constants/tasks';
import { Task, Plant, GardenState } from './types';
import { format } from 'date-fns';
import { Trophy, Sparkles, Flame, BarChart3, Settings } from 'lucide-react';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { cn } from './lib/utils';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [garden, setGarden] = useState<GardenState>({
    level: 1,
    experience: 0,
    plants: []
  });
  const [streak, setStreak] = useState(0);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Load state
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks-${today}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(getDailyTasks(today));
    }

    const savedGarden = localStorage.getItem('garden-state');
    if (savedGarden) {
      setGarden(JSON.parse(savedGarden));
    } else {
      // Initial plants
      setGarden({
        level: 1,
        experience: 0,
        plants: [
          { id: 'p1', type: 'shrub', stage: 1, position: { x: 20, y: 10 } },
          { id: 'p2', type: 'shrub', stage: 1, position: { x: 70, y: 15 } },
        ]
      });
    }

    const savedStreak = localStorage.getItem('streak');
    setStreak(savedStreak ? parseInt(savedStreak) : 0);
  }, [today]);

  // Save state
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks-${today}`, JSON.stringify(tasks));
    }
    localStorage.setItem('garden-state', JSON.stringify(garden));
  }, [tasks, garden, today]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          handleTaskCompletion(t);
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const handleTaskCompletion = (task: Task) => {
    setGarden(prev => {
      const newExp = prev.experience + task.points;
      const newLevel = Math.floor(newExp / 100) + 1;
      
      // Grow existing plants or add new ones
      const updatedPlants = [...prev.plants];
      const randomPlantIndex = Math.floor(Math.random() * updatedPlants.length);
      
      if (updatedPlants[randomPlantIndex].stage < 3) {
        updatedPlants[randomPlantIndex].stage += 1;
      } else {
        // Add new plant
        const types: Plant['type'][] = ['flower', 'tree', 'shrub'];
        updatedPlants.push({
          id: `p-${Date.now()}`,
          type: types[Math.floor(Math.random() * types.length)],
          stage: 1,
          position: { 
            x: 10 + Math.random() * 80, 
            y: 5 + Math.random() * 20 
          }
        });
      }

      return {
        ...prev,
        level: newLevel,
        experience: newExp,
        plants: updatedPlants
      };
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <Web3Provider>
      <div className="min-h-screen bg-bg-app font-sans text-[#1A1A1B] pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b-2 border-soft-blue px-10 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-base-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                W
              </div>
              <div>
                <h1 className="font-extrabold text-2xl tracking-tight">TinyWin</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Base Mainnet</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="vibrant-pill">
                <span>🔥</span> {streak} Day Streak
              </div>
              <div className="vibrant-pill">
                <span>✨</span> {garden.experience} Points
              </div>
              <button className="vibrant-pill bg-base-blue text-white hover:bg-blue-700 transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-10 pt-8 grid grid-cols-1 lg:grid-cols-[380px_1fr_240px] gap-8">
          {/* Column 1: Tasks */}
          <section className="vibrant-card h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Daily Wins</h2>
              <span className="text-xs font-bold text-slate-400">
                {completedCount}/{tasks.length} DONE
              </span>
            </div>
            
            <TaskList tasks={tasks} onToggle={toggleTask} />
            
            <div className="mt-8">
              <BaseCheckIn />
            </div>
          </section>

          {/* Column 2: Garden View */}
          <section className="space-y-6">
            <div className="bg-white rounded-[32px] p-2 border-4 border-white shadow-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#E0F2FE] to-[#F0F9FF] z-0" />
              <div className="relative z-10">
                <Garden plants={garden.plants} />
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center">
                <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg border border-white mb-4">
                  <h3 className="text-2xl font-extrabold">The Zen Oak</h3>
                  <p className="text-sm text-slate-500 font-medium">Grows with your consistency</p>
                </div>
              </div>
            </div>

            <div className="vibrant-card">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span>Garden Level {garden.level}</span>
                <span>{garden.experience % 100}% to next level</span>
              </div>
              <Progress value={garden.experience % 100} className="h-4 bg-soft-blue" />
            </div>
          </section>

          {/* Column 3: Stats & Friends */}
          <aside className="space-y-6">
            <div className="vibrant-card p-4">
              <h3 className="font-bold mb-4">My Week</h3>
              <div className="grid grid-cols-7 gap-1.5">
                {[
                  'leaf-green', 'leaf-green', 'sun-yellow', 'leaf-green', 'fire-orange', 'leaf-green', 'slate-200'
                ].map((color, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-md ${color.startsWith('slate') ? 'bg-slate-200' : `bg-${color}`}`} 
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                High energy weekend! Keep it up.
              </p>
            </div>

            <div className="vibrant-card p-4 flex-1">
              <h3 className="font-bold mb-4">Friends</h3>
              <div className="space-y-4">
                {[
                  { name: 'Alex.base', wins: '2.8k', avatar: '🦊', rank: 1, color: '#FEF3C7' },
                  { name: 'You', wins: '2.4k', avatar: '👤', rank: 2, color: '#E0E7FF', me: true },
                  { name: 'Mila_W', wins: '2.1k', avatar: '🐹', rank: 3, color: '#FCE7F3' },
                  { name: 'Vitalik', wins: '1.9k', avatar: '🐼', rank: 4, color: '#DCFCE7' },
                ].map((user) => (
                  <div key={user.name} className="flex items-center gap-3 text-sm">
                    <span className="w-4 font-extrabold text-slate-300 text-xs">{user.rank}</span>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.avatar}
                    </div>
                    <div className={cn("flex-1 font-bold truncate", user.me && "text-base-blue")}>
                      {user.name}
                    </div>
                    <div className="text-[11px] font-bold opacity-40">{user.wins}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </Web3Provider>
  );
}
