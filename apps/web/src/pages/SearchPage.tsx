import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function SearchPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen flex items-center justify-center bg-black"
    >
      <h1 className="font-display text-3xl text-text-secondary">Search — coming soon - Phase 13</h1>
    </motion.div>
  );
}