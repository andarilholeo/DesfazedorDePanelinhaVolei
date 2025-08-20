'use client';

import { useConfiguracoes } from '@/hooks/useConfiguracoes';

export default function Configuracoes() {
  const { configuracoes, isLoading, atualizarConfiguracao, resetarConfiguracoes } = useConfiguracoes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-lg border border-primary-cream">
        <h2 className="text-xl font-semibold text-primary-dark mb-4">
          ⚙️ Configurações do Sorteio
        </h2>
        <p className="text-sm text-primary-dark/70 mb-6">
          Configure as regras que serão aplicadas durante o sorteio de times.
        </p>

        <div className="space-y-6">
          {/* Configuração: Exigir Mulher por Time */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary-dark mb-2">
                  👩 Exigir 1 Mulher por Time
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Quando ativado, cada time terá obrigatoriamente 1 mulher. Se desativado, 
                  as mulheres serão distribuídas aleatoriamente entre os times.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Ativado:</strong> Garante distribuição equilibrada de gênero<br/>
                  <strong>Desativado:</strong> Distribuição totalmente aleatória
                </div>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.exigirMulherPorTime}
                    onChange={(e) => atualizarConfiguracao('exigirMulherPorTime', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Configuração: Exigir Cabeça de Chave por Time */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary-dark mb-2">
                  ⭐ Exigir 1 Cabeça de Chave por Time
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Quando ativado, cada time terá obrigatoriamente 1 cabeça de chave. Se desativado, 
                  os cabeças de chave serão distribuídos aleatoriamente entre os times.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Ativado:</strong> Garante times equilibrados em habilidade<br/>
                  <strong>Desativado:</strong> Distribuição totalmente aleatória
                </div>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.exigirCabecaChavePorTime}
                    onChange={(e) => atualizarConfiguracao('exigirCabecaChavePorTime', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Status Atual */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">📋 Configuração Atual</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${configuracoes.exigirMulherPorTime ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              Exigir mulher por time: <strong>{configuracoes.exigirMulherPorTime ? 'Ativado' : 'Desativado'}</strong>
            </div>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${configuracoes.exigirCabecaChavePorTime ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              Exigir cabeça de chave por time: <strong>{configuracoes.exigirCabecaChavePorTime ? 'Ativado' : 'Desativado'}</strong>
            </div>
          </div>
        </div>

        {/* Botão Reset */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={resetarConfiguracoes}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            🔄 Restaurar Padrão
          </button>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Dicas</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• As configurações são salvas automaticamente</li>
          <li>• Mudanças afetam apenas sorteios futuros</li>
          <li>• Com ambas as regras desativadas, o sorteio será completamente aleatório</li>
          <li>• Recomendamos manter pelo menos uma regra ativada para times equilibrados</li>
        </ul>
      </div>
    </div>
  );
}
