'use client';

import { useState } from 'react';
import { Jogador } from '@/types';
import AdicionarPorLista from './AdicionarPorLista';

interface JogadoresManagerProps {
  jogadores: Jogador[];
  onAdicionarJogador: (jogador: Omit<Jogador, 'id'>) => void;
  onEditarJogador: (id: string, dados: Partial<Omit<Jogador, 'id'>>) => void;
  onRemoverJogador: (id: string) => void;
  onLimparJogadores: () => void;
  estatisticas: {
    total: number;
    homens: number;
    mulheres: number;
    cabecasChave: number;
  };
}

export default function JogadoresManager({
  jogadores,
  onAdicionarJogador,
  onEditarJogador,
  onRemoverJogador,
  onLimparJogadores,
  estatisticas,
}: JogadoresManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [editingJogador, setEditingJogador] = useState<Jogador | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    sexo: 'M' as 'M' | 'F',
    cabecaChave: false,
  });

  const resetForm = () => {
    setFormData({ nome: '', sexo: 'M', cabecaChave: false });
    setEditingJogador(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    if (editingJogador) {
      onEditarJogador(editingJogador.id, formData);
    } else {
      onAdicionarJogador(formData);
    }
    resetForm();
  };

  const handleEdit = (jogador: Jogador) => {
    setFormData({
      nome: jogador.nome,
      sexo: jogador.sexo,
      cabecaChave: jogador.cabecaChave,
    });
    setEditingJogador(jogador);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este jogador?')) {
      onRemoverJogador(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Tem certeza que deseja remover TODOS os jogadores? Esta ação não pode ser desfeita.')) {
      onLimparJogadores();
    }
  };

  const handleAdicionarPorLista = (novosJogadores: Omit<Jogador, 'id'>[]) => {
    novosJogadores.forEach(jogador => {
      onAdicionarJogador(jogador);
    });
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-cream">
          <div className="text-2xl font-bold text-primary-orange">{estatisticas.total}</div>
          <div className="text-sm text-primary-dark">Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-cream">
          <div className="text-2xl font-bold text-blue-600">{estatisticas.homens}</div>
          <div className="text-sm text-primary-dark">Homens</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-cream">
          <div className="text-2xl font-bold text-pink-600">{estatisticas.mulheres}</div>
          <div className="text-sm text-primary-dark">Mulheres</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-primary-cream">
          <div className="text-2xl font-bold text-yellow-600">{estatisticas.cabecasChave}</div>
          <div className="text-sm text-primary-dark">Cabeças de Chave</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-orange hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Adicionar Jogador
        </button>
        <button
          onClick={() => setShowListModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          📋 Adicionar Por Lista
        </button>
        {jogadores.length > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Limpar Todos
          </button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-primary-cream">
          <h3 className="text-lg font-semibold text-primary-dark mb-4">
            {editingJogador ? 'Editar Jogador' : 'Adicionar Novo Jogador'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                placeholder="Digite o nome do jogador"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Sexo
              </label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value as 'M' | 'F' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cabecaChave"
                checked={formData.cabecaChave}
                onChange={(e) => setFormData({ ...formData, cabecaChave: e.target.checked })}
                className="h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
              />
              <label htmlFor="cabecaChave" className="ml-2 text-sm text-primary-dark">
                Cabeça de Chave
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary-orange hover:bg-primary-light text-primary-dark px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {editingJogador ? 'Salvar' : 'Adicionar'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Jogadores */}
      <div className="bg-white rounded-lg shadow-lg border border-primary-cream">
        <div className="p-4 border-b border-primary-cream">
          <h3 className="text-lg font-semibold text-primary-dark">
            Lista de Jogadores ({jogadores.length})
          </h3>
        </div>
        <div className="p-4">
          {jogadores.length === 0 ? (
            <div className="text-center py-8 text-primary-dark/60">
              <div className="text-4xl mb-4">🏐</div>
              <p>Nenhum jogador cadastrado ainda.</p>
              <p className="text-sm mt-2">Clique em &quot;Adicionar Jogador&quot; para começar!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {jogadores.map((jogador) => (
                <div
                  key={jogador.id}
                  className="flex items-center justify-between p-3 bg-primary-cream/30 rounded-lg hover:bg-primary-cream/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {jogador.sexo === 'M' ? '👨' : '👩'}
                    </div>
                    <div>
                      <div className="font-medium text-primary-dark">
                        {jogador.nome}
                        {jogador.cabecaChave && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ Cabeça de Chave
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-primary-dark/60">
                        {jogador.sexo === 'M' ? 'Masculino' : 'Feminino'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(jogador)}
                      className="text-primary-orange hover:text-primary-light transition-colors p-1"
                      title="Editar jogador"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(jogador.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1"
                      title="Remover jogador"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar Por Lista */}
      <AdicionarPorLista
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        onAdicionarJogadores={handleAdicionarPorLista}
      />
    </div>
  );
}
