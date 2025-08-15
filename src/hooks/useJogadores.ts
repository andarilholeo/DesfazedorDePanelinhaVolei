'use client';

import { useState, useEffect } from 'react';
import { Jogador } from '@/types';

const STORAGE_KEY = 'sorteio-volei-jogadores';

export function useJogadores() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar jogadores do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedJogadores = JSON.parse(stored);
        setJogadores(parsedJogadores);
      }
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar jogadores no localStorage
  const salvarJogadores = (novosJogadores: Jogador[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosJogadores));
      setJogadores(novosJogadores);
    } catch (error) {
      console.error('Erro ao salvar jogadores:', error);
    }
  };

  // Adicionar jogador
  const adicionarJogador = (jogador: Omit<Jogador, 'id'>) => {
    const novoJogador: Jogador = {
      ...jogador,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const novosJogadores = [...jogadores, novoJogador];
    salvarJogadores(novosJogadores);
  };

  // Editar jogador
  const editarJogador = (id: string, dadosAtualizados: Partial<Omit<Jogador, 'id'>>) => {
    const novosJogadores = jogadores.map(jogador =>
      jogador.id === id ? { ...jogador, ...dadosAtualizados } : jogador
    );
    salvarJogadores(novosJogadores);
  };

  // Remover jogador
  const removerJogador = (id: string) => {
    const novosJogadores = jogadores.filter(jogador => jogador.id !== id);
    salvarJogadores(novosJogadores);
  };

  // Limpar todos os jogadores
  const limparJogadores = () => {
    salvarJogadores([]);
  };

  // Estatísticas
  const estatisticas = {
    total: jogadores.length,
    homens: jogadores.filter(j => j.sexo === 'M').length,
    mulheres: jogadores.filter(j => j.sexo === 'F').length,
    cabecasChave: jogadores.filter(j => j.cabecaChave).length,
  };

  return {
    jogadores,
    isLoading,
    adicionarJogador,
    editarJogador,
    removerJogador,
    limparJogadores,
    estatisticas,
  };
}
