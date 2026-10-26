import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WallpaperProps {
  currentTheme: string;
}

export const WALLPAPERS = [
  { id: 'light-grey', name: 'Light Grey (Default)', overlay: '#f8fafc' },
  { id: 'white-clean', name: 'White', overlay: '#ffffff' },
  { id: 'pastel-waves', name: 'Pastel Waves', overlay: '/wallpapers/pastel-soothing-bg.jpg' },
  { id: 'immersive', name: 'Original', overlay: 'radial-gradient(circle at 20% 20%, #1e293b 0%, #0c0d12 100%), radial-gradient(circle at 80% 80%, #312e81 0%, transparent 50%)' },
  { id: 'cyan-yellow', name: 'Sky', overlay: 'linear-gradient(135deg, #00d2ff 0%, #f7ff00 100%)' },
  { id: 'soft-blue', name: 'Spring', overlay: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
  { id: 'mint-blue', name: 'Fresh', overlay: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { id: 'sunset-bright', name: 'Candy', overlay: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'purple-vibe', name: 'Royal', overlay: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'northern-lights', name: 'Glow', overlay: 'radial-gradient(circle at 20% 30%, #059669 0%, #064e3b 100%)' },
];

export const GRADIENTS_MAP: Record<string, string> = {
  'aurora': 'linear-gradient(135deg, #60a5fa, #a78bfa)',
  'sunset': 'linear-gradient(135deg, #fbbf24, #ef4444)',
  'ocean': 'linear-gradient(135deg, #0ea5e9, #22c55e)',
  'cosmic': 'linear-gradient(135deg, #818cf8, #c084fc)',
  'fire': 'linear-gradient(135deg, #f87171, #facc15)',
  'cyber': 'linear-gradient(135deg, #2dd4bf, #e879f9)',
  'forest': 'linear-gradient(135deg, #34d399, #064e3b)',
  'deep-space': 'linear-gradient(135deg, #1e293b, #000000)',
  // 10 2-color mixing colors
  'mix-aurora': 'linear-gradient(135deg, #60a5fa, #a78bfa)',
  'mix-sunset': 'linear-gradient(135deg, #fbbf24, #ef4444)',
  'mix-ocean': 'linear-gradient(135deg, #0ea5e9, #22c55e)',
  'mix-cosmic': 'linear-gradient(135deg, #6366f1, #ec4899)',
  'mix-fire': 'linear-gradient(135deg, #f97316, #facc15)',
  'mix-cyber': 'linear-gradient(135deg, #2dd4bf, #e879f9)',
  'mix-forest': 'radial-gradient(circle at 20% 20%, #bae6fd 0%, #ffffff 50%, #ede9fe 100%)',
  'mix-violetteal': 'linear-gradient(135deg, #7c3aed, #0d9488)',
  'mix-cottoncandy': 'linear-gradient(135deg, #f472b6, #38bdf8)',
  'mix-neonpurple': 'linear-gradient(135deg, #a7f3d0 0%, #bae6fd 30%, #fbcfe8 70%, #fed7aa 100%)',
};

export const SOLIDS_MAP: Record<string, string> = {
  'light-blue': '#f0f9ff',
  'light-pink': '#fff1f2',
  'light-green': '#f0fdf4',
  'light-yellow': '#fffbeb',
  'light-purple': '#f5f3ff',
  'light-orange': '#fff7ed',
  'light-teal': '#f0fdfa',
  'light-slate': '#f8fafc',
  'light-grey': '#f8fafc',
  'light-gray': '#f8fafc',
  'white-clean': '#ffffff',
  'light-indigo': '#f5f7ff',
  'light-stone': '#fafaf9',
  // 10 Regular colors
  'reg-blue': '#3b82f6',
  'reg-rose': '#e11d48',
  'reg-green': '#22c55e',
  'reg-yellow': '#eab308',
  'reg-purple': '#8b5cf6',
  'reg-orange': '#f97316',
  'reg-teal': '#14b8a6',
  'reg-slate': '#64748b',
  'reg-indigo': '#6366f1',
  'reg-pink': '#ec4899',
  // 10 Dark colors
  'dark-rust': '#7c2d12',
  'dark-blue': '#1e3a8a',
  'dark-purple': '#581c87',
  'dark-ruby': '#4c0519',
  'dark-green': '#064e3b',
  'dark-bronze': '#451a03',
  'dark-wine': '#881337',
  'dark-teal': '#115e59',
  'dark-indigo': '#312e81',
  'dark-midnight': '#030712',
};

export default function Wallpaper({ currentTheme, isDarkMode }: { currentTheme: string; isDarkMode: boolean }) {
  const isCustom = currentTheme.startsWith('data:image') || 
                   currentTheme.startsWith('http://') || 
                   currentTheme.startsWith('https://') || 
                   currentTheme.startsWith('/') || 
                   currentTheme.startsWith('blob:');
  const isHex = currentTheme.startsWith('#');
  const isGradient = GRADIENTS_MAP[currentTheme];
  const isSolid = SOLIDS_MAP[currentTheme];
  
  const theme = WALLPAPERS.find(w => w.id === currentTheme) || 
               (isCustom ? { id: 'custom', overlay: currentTheme } : WALLPAPERS[0]);

  let backgroundStyle: React.CSSProperties = {};
  
  if (isCustom) {
    let finalUrl = currentTheme;
    // Upgrade Unsplash URLs to 8K resolution
    if (finalUrl.includes('images.unsplash.com')) {
      finalUrl = finalUrl.replace('q=80', 'q=100').replace(/w=\d+/, 'w=7680');
    }
    backgroundStyle = { backgroundImage: `url(${finalUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  } else if (isHex) {
    backgroundStyle = { backgroundColor: currentTheme };
  } else if (isGradient) {
    backgroundStyle = { background: GRADIENTS_MAP[currentTheme] };
  } else if (isSolid) {
    backgroundStyle = { backgroundColor: SOLIDS_MAP[currentTheme] };
  } else if (currentTheme === 'pastel-waves' || currentTheme === 'mix-neonpurple') {
    backgroundStyle = {
      backgroundColor: '#d8f0fa',
      backgroundImage: `radial-gradient(ellipse at 15% 15%, rgba(142, 227, 239, 0.75) 0%, transparent 60%),
                        radial-gradient(ellipse at 85% 15%, rgba(255, 198, 255, 0.75) 0%, transparent 60%),
                        radial-gradient(ellipse at 25% 85%, rgba(216, 180, 254, 0.75) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 85%, rgba(167, 243, 208, 0.7) 0%, transparent 55%),
                        url('/wallpapers/pastel-soothing-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'top center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
    };
  } else if (currentTheme === 'mix-forest') {
    backgroundStyle = {
      backgroundColor: '#ffffff',
      backgroundImage: `
        radial-gradient(ellipse 60% 45% at 8% 12%, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.2) 45%, transparent 70%),
        radial-gradient(ellipse 60% 45% at 92% 14%, rgba(233, 213, 255, 0.45) 0%, rgba(243, 232, 255, 0.2) 45%, transparent 70%),
        radial-gradient(ellipse 50% 35% at 50% 28%, rgba(224, 231, 255, 0.3) 0%, transparent 60%),
        radial-gradient(ellipse 65% 50% at 12% 82%, rgba(237, 233, 254, 0.4) 0%, transparent 65%),
        radial-gradient(ellipse 65% 50% at 88% 85%, rgba(186, 230, 253, 0.4) 0%, transparent 65%)
      `,
      backgroundAttachment: 'scroll',
      minHeight: '100%',
    };
  } else if (currentTheme === 'light-grey' || currentTheme === 'light-slate') {
    backgroundStyle = {
      backgroundColor: '#f8fafc',
      minHeight: '100%',
    };
  } else if (currentTheme === 'white-clean') {
    backgroundStyle = {
      backgroundColor: '#ffffff',
      minHeight: '100%',
    };
  } else if (!isDarkMode && currentTheme === 'immersive') {
    backgroundStyle = { backgroundColor: '#ffffff', minHeight: '100%' };
  } else {
    backgroundStyle = { background: theme.overlay, minHeight: '100%' };
  }

  return (
    <div className="absolute inset-0 w-full min-h-full h-full z-0 overflow-hidden transition-colors duration-500 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme + (isDarkMode ? 'dark' : 'light')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full min-h-full h-full"
          style={backgroundStyle}
        >
          {currentTheme === 'mix-forest' && (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              {/* Soft decorative light blue & light purple atmospheric color glows */}
              <div 
                className="absolute -top-32 -left-32 w-[420px] sm:w-[620px] h-[420px] sm:h-[620px] rounded-full blur-3xl opacity-75"
                style={{
                  background: 'radial-gradient(circle, rgba(186, 230, 253, 0.7) 0%, rgba(224, 242, 254, 0.4) 45%, transparent 75%)'
                }}
              />
              <div 
                className="absolute -top-28 -right-28 w-[420px] sm:w-[640px] h-[420px] sm:h-[640px] rounded-full blur-3xl opacity-70"
                style={{
                  background: 'radial-gradient(circle, rgba(233, 213, 255, 0.7) 0%, rgba(243, 232, 255, 0.4) 45%, transparent 75%)'
                }}
              />
              <div 
                className="absolute top-[32%] -left-36 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full blur-3xl opacity-60"
                style={{
                  background: 'radial-gradient(circle, rgba(216, 180, 254, 0.55) 0%, rgba(237, 233, 254, 0.3) 50%, transparent 75%)'
                }}
              />
              <div 
                className="absolute top-[38%] -right-36 w-[360px] sm:w-[560px] h-[360px] sm:h-[560px] rounded-full blur-3xl opacity-65"
                style={{
                  background: 'radial-gradient(circle, rgba(186, 230, 253, 0.6) 0%, rgba(224, 242, 254, 0.35) 50%, transparent 75%)'
                }}
              />
              <div 
                className="absolute -bottom-28 left-[5%] w-[520px] sm:w-[740px] h-[380px] rounded-full blur-3xl opacity-65"
                style={{
                  background: 'radial-gradient(circle, rgba(237, 233, 254, 0.6) 0%, rgba(243, 232, 255, 0.3) 50%, transparent 75%)'
                }}
              />
              <div 
                className="absolute -bottom-24 right-[5%] w-[500px] sm:w-[720px] h-[380px] rounded-full blur-3xl opacity-70"
                style={{
                  background: 'radial-gradient(circle, rgba(186, 230, 253, 0.65) 0%, rgba(224, 242, 254, 0.35) 50%, transparent 75%)'
                }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
