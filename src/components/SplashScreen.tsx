'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Aguarda a animação de saída
    }, 2500); // Mostra por 2.5 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-orange via-primary-light to-primary-cream transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <div className="text-6xl">🏐</div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          Sorteio Vôlei
        </h1>

        <p className="text-xl text-white/90 mb-8 drop-shadow">
          Sorteador de times inteligente
        </p>

        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>   
    </div>
  );
}
