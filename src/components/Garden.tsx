import { motion, AnimatePresence } from 'motion/react';
import { Plant } from '../types';
import { Flower, TreeDeciduous, Leaf } from 'lucide-react';

interface GardenProps {
  plants: Plant[];
}

export function Garden({ plants }: GardenProps) {
  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-sky-100 to-emerald-50 rounded-3xl overflow-hidden border-4 border-emerald-100 shadow-inner">
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-12 bg-emerald-200/50" />
      
      <AnimatePresence>
        {plants.map((plant) => (
          <motion.div
            key={plant.id}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="absolute"
            style={{ 
              left: `${plant.position.x}%`, 
              bottom: `${plant.position.y}%`,
              zIndex: Math.floor(100 - plant.position.y)
            }}
          >
            <motion.div
              animate={{ 
                scale: 0.8 + (plant.stage * 0.4),
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              className="flex flex-col items-center"
            >
              {plant.type === 'flower' && (
                <Flower className="text-pink-400 fill-pink-100" size={32} />
              )}
              {plant.type === 'tree' && (
                <TreeDeciduous className="text-emerald-600 fill-emerald-100" size={48} />
              )}
              {plant.type === 'shrub' && (
                <Leaf className="text-green-500 fill-green-100" size={24} />
              )}
              
              {/* Stem/Base */}
              <div className="w-1 h-4 bg-emerald-800/20 rounded-full -mt-1" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Clouds */}
      <motion.div 
        animate={{ x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute top-8 left-10 opacity-20"
      >
        <div className="w-12 h-6 bg-white rounded-full" />
      </motion.div>
      <motion.div 
        animate={{ x: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-12 right-12 opacity-20"
      >
        <div className="w-16 h-8 bg-white rounded-full" />
      </motion.div>
    </div>
  );
}
