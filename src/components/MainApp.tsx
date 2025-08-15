'use client';

import { useState } from 'react';
import { useJogadores } from '@/hooks/useJogadores';
import JogadoresManager from './JogadoresManager';
import SorteadorInterface from './SorteadorInterface';

type TabType = 'jogadores' | 'sorteio';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('jogadores');
  const { jogadores, isLoading, adicionarJogador, editarJogador, removerJogador, limparJogadores, estatisticas } = useJogadores();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-darker">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto mb-4"></div>
          <p className="text-primary-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-cream">
      <header className="bg-primary-orange shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white text-center">
            🏐 Sorteio Vôlei
          </h1>
          <p className="text-white/90 text-center mt-2 line-through decoration-primary-orange">
            Evitador de panelinha
          </p>
          <p className="text-white/90 text-center mt-2">
            Sorteador (não tão) inteligente de times
          </p>
        </div>
      </header>

      <nav className="bg-primary-darker shadow-sm border-b border-primary-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('jogadores')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'jogadores'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-primary-dark hover:text-primary-orange hover:border-primary-light'
              }`}
            >
              Jogadores ({estatisticas.total})
            </button>
            <button
              onClick={() => setActiveTab('sorteio')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sorteio'
                  ? 'border-primary-orange text-primary-orange'
                  : 'border-transparent text-primary-dark hover:text-primary-orange hover:border-primary-light'
              }`}
            >
              Sorteio
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'jogadores' && (
          <JogadoresManager
            jogadores={jogadores}
            onAdicionarJogador={adicionarJogador}
            onEditarJogador={editarJogador}
            onRemoverJogador={removerJogador}
            onLimparJogadores={limparJogadores}
            estatisticas={estatisticas}
          />
        )}
        
        {activeTab === 'sorteio' && (
          <SorteadorInterface jogadores={jogadores} />
        )}
      </main>

      <footer className="bg-primary-darker text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/80">
            Desenvolvido para o grupo de vôlei ou não🏐
          </p>
          <p className="text-white/60 text-sm mt-2">
            Tentando fazer a porra de um PWA s2
          </p>
        </div>
      </footer>
    </div>
  );
}
