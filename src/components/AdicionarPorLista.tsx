'use client';

import { useState } from 'react';
import { Jogador } from '@/types';

interface AdicionarPorListaProps {
  isOpen: boolean;
  onClose: () => void;
  onAdicionarJogadores: (jogadores: Omit<Jogador, 'id'>[]) => void;
}

export default function AdicionarPorLista({ isOpen, onClose, onAdicionarJogadores }: AdicionarPorListaProps) {
  const [texto, setTexto] = useState('');
  const [jogadoresProcessados, setJogadoresProcessados] = useState<Omit<Jogador, 'id'>[]>([]);
  const [mostrarPreview, setMostrarPreview] = useState(false);

  const processarLista = () => {
    if (!texto.trim()) return;

    const linhas = texto.split('\n').filter(linha => linha.trim());
    const nomes: string[] = [];

    linhas.forEach(linha => {
      const linhaTrimmed = linha.trim();
      
      // Pular linhas que parecem ser títulos (ex: "Vôlei hj")
      if (linhaTrimmed.toLowerCase().includes('vôlei') || 
          linhaTrimmed.toLowerCase().includes('volei') ||
          linhaTrimmed.length < 2) {
        return;
      }

      let nome = '';

      // Formato com números (1 Nome, 2 Nome, etc.)
      if (/^\d+\s+/.test(linhaTrimmed)) {
        nome = linhaTrimmed.replace(/^\d+\s+/, '').trim();
      }
      // Formato com traço (- Nome)
      else if (linhaTrimmed.startsWith('-')) {
        nome = linhaTrimmed.substring(1).trim();
      }
      // Formato com ponto (. Nome)
      else if (linhaTrimmed.startsWith('.')) {
        nome = linhaTrimmed.substring(1).trim();
      }
      // Formato sem marcador (apenas o nome)
      else {
        nome = linhaTrimmed;
      }

      // Limpar caracteres especiais invisíveis e espaços extras
      nome = nome.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

      if (nome && nome.length > 1) {
        nomes.push(nome);
      }
    });

    // Criar jogadores com valores padrão
    const novosJogadores: Omit<Jogador, 'id'>[] = nomes.map(nome => ({
      nome,
      sexo: 'M' as const, // Padrão masculino, usuário pode editar depois
      cabecaChave: false, // Padrão não é cabeça de chave
    }));

    setJogadoresProcessados(novosJogadores);
    setMostrarPreview(true);
  };

  const confirmarAdicao = () => {
    onAdicionarJogadores(jogadoresProcessados);
    resetar();
    onClose();
  };

  const resetar = () => {
    setTexto('');
    setJogadoresProcessados([]);
    setMostrarPreview(false);
  };

  const handleClose = () => {
    resetar();
    onClose();
  };

  const editarJogador = (index: number, campo: 'nome' | 'sexo' | 'cabecaChave', valor: string | boolean) => {
    const novosJogadores = [...jogadoresProcessados];
    novosJogadores[index] = { ...novosJogadores[index], [campo]: valor };
    setJogadoresProcessados(novosJogadores);
  };

  const removerJogador = (index: number) => {
    const novosJogadores = jogadoresProcessados.filter((_, i) => i !== index);
    setJogadoresProcessados(novosJogadores);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-orange text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Adicionar Jogadores por Lista</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!mostrarPreview ? (
            // Etapa 1: Colar lista
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Cole a lista de jogadores aqui:
                </label>
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent resize-none"
                  placeholder="Cole aqui a lista de jogadores. Exemplos:

Vôlei hj
- Letícia 
- Case
- Igor Farias

ou

1 Letícia 
2 Case
3 Igor Farias

ou

. Letícia 
. Case
. Igor Farias"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">📋 Formatos Suportados:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Com traço:</strong> - Nome do Jogador</li>
                  <li>• <strong>Com ponto:</strong> . Nome do Jogador</li>
                  <li>• <strong>Com número:</strong> 1 Nome do Jogador</li>
                  <li>• <strong>Sem marcador:</strong> Nome do Jogador</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                  Linhas com &quot;vôlei&quot; ou muito curtas serão ignoradas automaticamente.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={processarLista}
                  disabled={!texto.trim()}
                  className="bg-primary-orange hover:bg-primary-light disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Processar Lista
                </button>
                <button
                  onClick={handleClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            // Etapa 2: Preview e edição
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">
                  ✅ {jogadoresProcessados.length} jogadores encontrados
                </h3>
                <p className="text-sm text-green-700">
                  Revise os dados abaixo e faça ajustes se necessário. Por padrão, todos são definidos como masculino e não cabeça de chave.
                </p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {jogadoresProcessados.map((jogador, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={jogador.nome}
                        onChange={(e) => editarJogador(index, 'nome', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                        placeholder="Nome do jogador"
                      />
                    </div>
                    <div>
                      <select
                        value={jogador.sexo}
                        onChange={(e) => editarJogador(index, 'sexo', e.target.value as 'M' | 'F')}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cabeca-${index}`}
                        checked={jogador.cabecaChave}
                        onChange={(e) => editarJogador(index, 'cabecaChave', e.target.checked)}
                        className="h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
                      />
                      <label htmlFor={`cabeca-${index}`} className="ml-2 text-sm text-primary-dark">
                        Cabeça de Chave
                      </label>
                    </div>
                    <button
                      onClick={() => removerJogador(index)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Remover jogador"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmarAdicao}
                  disabled={jogadoresProcessados.length === 0}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Adicionar {jogadoresProcessados.length} Jogadores
                </button>
                <button
                  onClick={() => setMostrarPreview(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleClose}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
