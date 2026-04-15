import { Task } from '../types';
import { CheckCircle2, Circle, Droplets, Activity, Heart, Wind, Calendar, BookOpen, Move, Cloud, Layout, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  Droplets, Activity, Heart, Wind, Calendar, BookOpen, Move, Cloud, Layout, Phone
};

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
}

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const Icon = iconMap[task.icon] || Circle;
        return (
          <motion.button
            key={task.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(task.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300",
              task.completed 
                ? "bg-[#F0FDF4] border-leaf-green text-[#1A1A1B]" 
                : "bg-[#FAFBFF] border-transparent text-slate-600"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              task.completed ? "bg-leaf-green border-leaf-green" : "border-[#D1D5DB]"
            )}>
              {task.completed && <CheckCircle2 className="text-white" size={14} />}
            </div>
            
            <div className="flex-1 text-left">
              <h4 className={cn(
                "font-bold text-[15px]",
                task.completed && "opacity-60"
              )}>
                {task.title}
              </h4>
              <p className="text-xs text-slate-400">Micro-win of the day</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
