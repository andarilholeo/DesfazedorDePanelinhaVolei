import { Time, ConfigSorteio, ResultadoSorteio } from '@/types';

// Função para embaralhar array
function embaralhar<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função principal de sorteio
export function sortearTimes(config: ConfigSorteio): ResultadoSorteio {
  const { jogadoresPorTime, jogadoresDisponiveis, configuracoes } = config;

  // Configurações padrão se não fornecidas
  const exigirMulherPorTime = configuracoes?.exigirMulherPorTime ?? true;
  const exigirCabecaChavePorTime = configuracoes?.exigirCabecaChavePorTime ?? true;
  
  // Validações
  if (jogadoresPorTime < 2) {
    throw new Error('Cada time deve ter pelo menos 2 jogadores');
  }

  const cabecasChave = jogadoresDisponiveis.filter(j => j.cabecaChave);
  const mulheres = jogadoresDisponiveis.filter(j => j.sexo === 'F');
  const outrosJogadores = jogadoresDisponiveis.filter(j => !j.cabecaChave && j.sexo === 'M');

  // Calcular quantos times podem ser formados baseado nas configurações
  let maxTimes = Math.floor(jogadoresDisponiveis.length / jogadoresPorTime);

  if (exigirCabecaChavePorTime && exigirMulherPorTime) {
    // Ambas as regras ativas: limitado por cabeças de chave E mulheres
    const maxTimesPorCabecas = cabecasChave.length;
    const maxTimesPorMulheres = mulheres.length;
    maxTimes = Math.min(maxTimes, maxTimesPorCabecas, maxTimesPorMulheres);

    if (maxTimes === 0) {
      throw new Error('É necessário pelo menos 1 cabeça de chave e 1 mulher para formar times');
    }
  } else if (exigirCabecaChavePorTime) {
    // Apenas regra de cabeça de chave ativa
    const maxTimesPorCabecas = cabecasChave.length;
    maxTimes = Math.min(maxTimes, maxTimesPorCabecas);

    if (maxTimes === 0) {
      throw new Error('É necessário pelo menos 1 cabeça de chave para formar times');
    }
  } else if (exigirMulherPorTime) {
    // Apenas regra de mulher ativa
    const maxTimesPorMulheres = mulheres.length;
    maxTimes = Math.min(maxTimes, maxTimesPorMulheres);

    if (maxTimes === 0) {
      throw new Error('É necessário pelo menos 1 mulher para formar times');
    }
  }
  // Se nenhuma regra estiver ativa, maxTimes já está calculado apenas pelo total de jogadores

  // Verificar se há jogadores suficientes
  const jogadoresNecessarios = maxTimes * jogadoresPorTime;
  if (jogadoresDisponiveis.length < jogadoresNecessarios) {
    throw new Error(`Não há jogadores suficientes. Necessário: ${jogadoresNecessarios}, Disponível: ${jogadoresDisponiveis.length}`);
  }

  // Embaralhar os arrays
  const cabecasEmbaralhadas = embaralhar(cabecasChave);
  const mulheresEmbaralhadas = embaralhar(mulheres);
  const outrosEmbaralhados = embaralhar(outrosJogadores);

  // Criar times
  const times: Time[] = [];
  const jogadoresUsados = new Set<string>();

  for (let i = 0; i < maxTimes; i++) {
    const time: Time = {
      id: `time-${i + 1}`,
      jogadores: [],
    };

    // Adicionar cabeça de chave se a regra estiver ativa
    if (exigirCabecaChavePorTime && i < cabecasEmbaralhadas.length) {
      const cabeca = cabecasEmbaralhadas[i];
      time.jogadores.push(cabeca);
      time.cabecaChave = cabeca;
      jogadoresUsados.add(cabeca.id);
    }

    // Adicionar mulher se a regra estiver ativa
    if (exigirMulherPorTime && i < mulheresEmbaralhadas.length) {
      const mulher = mulheresEmbaralhadas[i];
      time.jogadores.push(mulher);
      time.mulher = mulher;
      jogadoresUsados.add(mulher.id);
    }

    times.push(time);
  }

  // Distribuir os jogadores restantes
  const jogadoresRestantes = [
    ...cabecasChave.slice(maxTimes),
    ...mulheres.slice(maxTimes),
    ...outrosEmbaralhados
  ].filter(j => !jogadoresUsados.has(j.id));

  const jogadoresRestantesEmbaralhados = embaralhar(jogadoresRestantes);

  // Completar os times
  let jogadorIndex = 0;
  for (const time of times) {
    while (time.jogadores.length < jogadoresPorTime && jogadorIndex < jogadoresRestantesEmbaralhados.length) {
      const jogador = jogadoresRestantesEmbaralhados[jogadorIndex];
      time.jogadores.push(jogador);
      jogadoresUsados.add(jogador.id);
      jogadorIndex++;
    }
  }

  // Jogadores que não foram sorteados
  const jogadoresNaoSorteados = jogadoresDisponiveis.filter(j => !jogadoresUsados.has(j.id));

  return {
    times,
    jogadoresNaoSorteados,
    configuracao: config,
  };
}

// Função para validar se é possível fazer o sorteio
export function validarSorteio(config: ConfigSorteio): { valido: boolean; erro?: string } {
  const { jogadoresPorTime, jogadoresDisponiveis, configuracoes } = config;

  if (jogadoresPorTime < 2) {
    return { valido: false, erro: 'Cada time deve ter pelo menos 2 jogadores' };
  }

  // Configurações padrão se não fornecidas
  const exigirMulherPorTime = configuracoes?.exigirMulherPorTime ?? true;
  const exigirCabecaChavePorTime = configuracoes?.exigirCabecaChavePorTime ?? true;

  const cabecasChave = jogadoresDisponiveis.filter(j => j.cabecaChave);
  const mulheres = jogadoresDisponiveis.filter(j => j.sexo === 'F');

  // Validações baseadas nas configurações
  if (exigirCabecaChavePorTime && cabecasChave.length === 0) {
    return { valido: false, erro: 'É necessário pelo menos 1 cabeça de chave (configuração ativa)' };
  }

  if (exigirMulherPorTime && mulheres.length === 0) {
    return { valido: false, erro: 'É necessário pelo menos 1 mulher (configuração ativa)' };
  }

  // Calcular máximo de times possível
  let maxTimes = Math.floor(jogadoresDisponiveis.length / jogadoresPorTime);

  if (exigirCabecaChavePorTime && exigirMulherPorTime) {
    maxTimes = Math.min(maxTimes, cabecasChave.length, mulheres.length);
  } else if (exigirCabecaChavePorTime) {
    maxTimes = Math.min(maxTimes, cabecasChave.length);
  } else if (exigirMulherPorTime) {
    maxTimes = Math.min(maxTimes, mulheres.length);
  }

  const jogadoresNecessarios = maxTimes * jogadoresPorTime;

  if (jogadoresDisponiveis.length < jogadoresNecessarios) {
    return {
      valido: false,
      erro: `Não há jogadores suficientes. Necessário: ${jogadoresNecessarios}, Disponível: ${jogadoresDisponiveis.length}`
    };
  }

  if (maxTimes === 0) {
    return { valido: false, erro: 'Não é possível formar nenhum time com as configurações atuais' };
  }

  return { valido: true };
}
