'use client';
import { motion } from 'framer-motion';

export default function FloatingWhatsApp() {
  const phoneNumber = '01825334505';
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/88${cleanPhone}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, x: 50 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: 0,
        y: [0, -10, 0],
      }}
      transition={{
        default: { duration: 0.5 },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 pl-5 pr-6 py-4 bg-[#25D366] text-white rounded-full shadow-[0_15px_35px_rgba(37,211,102,0.4)] hover:shadow-[0_20px_45px_rgba(37,211,102,0.6)] transition-all duration-500 group"
    >
      <div className="relative">
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.122.54 4.193 1.597 6.013L0 24l6.135-1.61a11.771 11.771 0 005.915 1.594h.005c6.637 0 12.032-5.391 12.035-12.027a11.768 11.768 0 00-3.527-8.508z"/>
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </div>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">সহযোগিতা</span>
        <span className="text-[8px] font-bold opacity-80 uppercase tracking-widest">লাইভ চ্যাট</span>
      </div>
    </motion.a>
    </motion.a>
  );
}
