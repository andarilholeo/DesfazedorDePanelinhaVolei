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
  const { jogadoresPorTime, jogadoresDisponiveis } = config;
  
  // Validações
  if (jogadoresPorTime < 2) {
    throw new Error('Cada time deve ter pelo menos 2 jogadores');
  }

  const cabecasChave = jogadoresDisponiveis.filter(j => j.cabecaChave);
  const mulheres = jogadoresDisponiveis.filter(j => j.sexo === 'F');
  const outrosJogadores = jogadoresDisponiveis.filter(j => !j.cabecaChave && j.sexo === 'M');

  // Calcular quantos times podem ser formados
  const maxTimesPorCabecas = cabecasChave.length;
  const maxTimesPorMulheres = mulheres.length;
  const maxTimes = Math.min(maxTimesPorCabecas, maxTimesPorMulheres);

  if (maxTimes === 0) {
    throw new Error('É necessário pelo menos 1 cabeça de chave e 1 mulher para formar times');
  }

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
    const cabeca = cabecasEmbaralhadas[i];
    const mulher = mulheresEmbaralhadas[i];
    
    const time: Time = {
      id: `time-${i + 1}`,
      jogadores: [cabeca, mulher],
      cabecaChave: cabeca,
      mulher: mulher,
    };

    jogadoresUsados.add(cabeca.id);
    jogadoresUsados.add(mulher.id);
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
  const { jogadoresPorTime, jogadoresDisponiveis } = config;

  if (jogadoresPorTime < 2) {
    return { valido: false, erro: 'Cada time deve ter pelo menos 2 jogadores' };
  }

  const cabecasChave = jogadoresDisponiveis.filter(j => j.cabecaChave);
  const mulheres = jogadoresDisponiveis.filter(j => j.sexo === 'F');

  if (cabecasChave.length === 0) {
    return { valido: false, erro: 'É necessário pelo menos 1 cabeça de chave' };
  }

  if (mulheres.length === 0) {
    return { valido: false, erro: 'É necessário pelo menos 1 mulher' };
  }

  const maxTimes = Math.min(cabecasChave.length, mulheres.length);
  const jogadoresNecessarios = maxTimes * jogadoresPorTime;

  if (jogadoresDisponiveis.length < jogadoresNecessarios) {
    return { 
      valido: false, 
      erro: `Não há jogadores suficientes. Necessário: ${jogadoresNecessarios}, Disponível: ${jogadoresDisponiveis.length}` 
    };
  }

  return { valido: true };
}
