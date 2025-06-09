
import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
}

export const InteractiveCard = ({ children, className }: InteractiveCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
