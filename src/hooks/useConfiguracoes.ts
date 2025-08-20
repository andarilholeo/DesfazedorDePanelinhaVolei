'use client';

import { useState, useEffect } from 'react';

export interface ConfiguracoesSorteio {
  exigirMulherPorTime: boolean;
  exigirCabecaChavePorTime: boolean;
}

const STORAGE_KEY = 'sorteio-volei-configuracoes';

const configuracoesPadrao: ConfiguracoesSorteio = {
  exigirMulherPorTime: true,
  exigirCabecaChavePorTime: true,
};

export function useConfiguracoes() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSorteio>(configuracoesPadrao);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedConfiguracoes = JSON.parse(stored);
        setConfiguracoes({ ...configuracoesPadrao, ...parsedConfiguracoes });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar configurações no localStorage
  const salvarConfiguracoes = (novasConfiguracoes: ConfiguracoesSorteio) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novasConfiguracoes));
      setConfiguracoes(novasConfiguracoes);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  // Atualizar configuração específica
  const atualizarConfiguracao = (chave: keyof ConfiguracoesSorteio, valor: boolean) => {
    const novasConfiguracoes = { ...configuracoes, [chave]: valor };
    salvarConfiguracoes(novasConfiguracoes);
  };

  // Resetar para padrão
  const resetarConfiguracoes = () => {
    salvarConfiguracoes(configuracoesPadrao);
  };

  return {
    configuracoes,
    isLoading,
    atualizarConfiguracao,
    resetarConfiguracoes,
    salvarConfiguracoes,
  };
}
