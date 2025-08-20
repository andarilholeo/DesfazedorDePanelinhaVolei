'use client';

import { useState } from 'react';
import { Jogador, ResultadoSorteio } from '@/types';
import { sortearTimes, validarSorteio } from '@/lib/sorteio';
import { ConfiguracoesSorteio } from '@/hooks/useConfiguracoes';

interface SorteadorInterfaceProps {
  jogadores: Jogador[];
  configuracoes: ConfiguracoesSorteio;
}

export default function SorteadorInterface({ jogadores, configuracoes }: SorteadorInterfaceProps) {
  const [jogadoresPorTime, setJogadoresPorTime] = useState(6);
  const [resultado, setResultado] = useState<ResultadoSorteio | null>(null);
  const [erro, setErro] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSortear = async () => {
    setIsLoading(true);
    setErro('');
    
    try {
      const config = {
        jogadoresPorTime,
        jogadoresDisponiveis: jogadores,
        configuracoes,
      };

      const validacao = validarSorteio(config);
      if (!validacao.valido) {
        setErro(validacao.erro || 'Erro na validação');
        return;
      }

      // Simular um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const novoResultado = sortearTimes(config);
      setResultado(novoResultado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNovoSorteio = () => {
    setResultado(null);
    setErro('');
  };

  const cabecasChave = jogadores.filter(j => j.cabecaChave);
  const mulheres = jogadores.filter(j => j.sexo === 'F');
  const maxTimes = Math.min(cabecasChave.length, mulheres.length);

  return (
    <div className="space-y-6">
      {/* Informações e Configuração */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-primary-cream">
        <h2 className="text-xl font-semibold text-primary-dark mb-4">
          Configuração do Sorteio
        </h2>
        
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-primary-cream/30 rounded-lg">
            <div className="text-lg font-bold text-primary-dark">{jogadores.length}</div>
            <div className="text-sm text-primary-dark/60">Total de Jogadores</div>
          </div>
          <div className="text-center p-3 bg-yellow-100 rounded-lg">
            <div className="text-lg font-bold text-yellow-800">{cabecasChave.length}</div>
            <div className="text-sm text-yellow-700">Cabeças de Chave</div>
          </div>
          <div className="text-center p-3 bg-pink-100 rounded-lg">
            <div className="text-lg font-bold text-pink-800">{mulheres.length}</div>
            <div className="text-sm text-pink-700">Mulheres</div>
          </div>
          <div className="text-center p-3 bg-green-100 rounded-lg">
            <div className="text-lg font-bold text-green-800">{maxTimes}</div>
            <div className="text-sm text-green-700">Times Possíveis</div>
          </div>
        </div>

        {/* Configuração */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Jogadores por Time
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={jogadoresPorTime}
              onChange={(e) => setJogadoresPorTime(parseInt(e.target.value) || 2)}
              className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
            />
            <div className="text-sm text-primary-dark/60 mt-1">
              <p>Regras ativas:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {configuracoes.exigirCabecaChavePorTime && (
                  <li>1 cabeça de chave por time</li>
                )}
                {configuracoes.exigirMulherPorTime && (
                  <li>1 mulher por time</li>
                )}
                {!configuracoes.exigirCabecaChavePorTime && !configuracoes.exigirMulherPorTime && (
                  <li>Sorteio completamente aleatório</li>
                )}
              </ul>
            </div>
          </div>

          {/* Botão de Sortear */}
          <div className="flex gap-3">
            <button
              onClick={handleSortear}
              disabled={isLoading || jogadores.length === 0}
              className="bg-primary-orange hover:bg-primary-light disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sorteando...
                </>
              ) : (
                <>
                  🎲 Sortear Times
                </>
              )}
            </button>
            
            {resultado && (
              <button
                onClick={handleNovoSorteio}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Novo Sorteio
              </button>
            )}
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700">{erro}</span>
            </div>
          </div>
        )}
      </div>

      {/* Resultado do Sorteio */}
      {resultado && (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-green-700 font-medium">
                Sorteio realizado com sucesso! {resultado.times.length} times formados.
              </span>
            </div>
          </div>

          {/* Times */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resultado.times.map((time, index) => (
              <div key={time.id} className="bg-white rounded-lg p-4 shadow-lg border border-primary-cream">
                <h3 className="text-lg font-semibold text-primary-dark mb-3 text-center">
                  Time {index + 1}
                </h3>
                <div className="space-y-2">
                  {time.jogadores.map((jogador) => (
                    <div
                      key={jogador.id}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        jogador.cabecaChave
                          ? 'bg-yellow-100 border border-yellow-300'
                          : jogador.sexo === 'F'
                          ? 'bg-pink-100 border border-pink-300'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="text-lg">
                        {jogador.sexo === 'M' ? '👨' : '👩'}
                      </span>
                      <span className="font-medium text-primary-dark">
                        {jogador.nome}
                      </span>
                      {jogador.cabecaChave && (
                        <span className="text-yellow-600 text-sm">⭐</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Jogadores não sorteados */}
          {resultado.jogadoresNaoSorteados.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                Jogadores não sorteados ({resultado.jogadoresNaoSorteados.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {resultado.jogadoresNaoSorteados.map((jogador) => (
                  <span
                    key={jogador.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800"
                  >
                    {jogador.sexo === 'M' ? '👨' : '👩'} {jogador.nome}
                    {jogador.cabecaChave && ' ⭐'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      {!resultado && jogadores.length === 0 && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🏐</div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Nenhum jogador cadastrado
          </h3>
          <p className="text-blue-700">
            Vá para a aba &quot;Jogadores&quot; e adicione pelo menos alguns jogadores para poder fazer o sorteio.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Lembre-se: é necessário pelo menos 1 cabeça de chave e 1 mulher para formar times.
          </p>
        </div>
      )}
    </div>
  );
}
