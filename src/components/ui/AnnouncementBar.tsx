'use client';
import { motion } from 'framer-motion';
import { Phone, Megaphone } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-secondary overflow-hidden relative border-y border-primary/20 shadow-lg">
      {/* Glowing accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex whitespace-nowrap py-3 md:py-4">
        <motion.div
          animate={{ x: ["5%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
          className="flex items-center gap-16 text-white font-bold"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Megaphone size={18} className="animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest border border-primary/30 px-2 py-0.5 rounded">Wholesale</span>
            </div>
            <p className="text-sm md:text-lg font-playfair tracking-wide italic">পাইকারি অর্ডারও নেওয়া হয়। দেশের যেকোনো প্রান্তে হোম ডেলিভারি!</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Phone size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest border border-primary/30 px-2 py-0.5 rounded">Contact</span>
            </div>
            <p className="text-sm md:text-lg font-playfair tracking-wide italic">যেকোনো তথ্যের জন্য কল করুন: <span className="text-primary font-jakarta not-italic">০১৮৮৩৩৬০৪৪০</span></p>
          </div>

          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Megaphone size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest border border-primary/30 px-2 py-0.5 rounded">Update</span>
            </div>
            <p className="text-sm md:text-lg font-playfair tracking-wide italic">আমাদের নতুন কালেকশন এখন লাইভ! স্টক ফুরিয়ে যাওয়ার আগেই অর্ডার করুন।</p>
          </div>
        </motion.div>
      </div>
      
      {/* Static Label on the left to make it look like a news channel */}
      <div className="absolute left-0 top-0 bottom-0 bg-primary px-4 md:px-6 flex items-center z-20 shadow-[10px_0_20px_rgba(0,0,0,0.3)] border-r border-white/20">
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-2 h-2 bg-white rounded-full animate-ping absolute inset-0" />
             <div className="w-2 h-2 bg-white rounded-full relative" />
           </div>
           <span className="text-white text-[11px] md:text-xs font-black uppercase tracking-[0.25em]">বিশেষ ঘোষণা</span>
        </div>
      </div>

      {/* Decorative gradient overlay at the end */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-secondary to-transparent z-10" />
    </div>
  );
}
