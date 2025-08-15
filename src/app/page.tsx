'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import MainApp from '@/components/MainApp';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && <MainApp />}
    </>
  );
}
