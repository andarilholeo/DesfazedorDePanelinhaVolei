export interface Jogador {
  id: string;
  nome: string;
  sexo: 'M' | 'F';
  cabecaChave: boolean;
}

export interface Time {
  id: string;
  jogadores: Jogador[];
  cabecaChave?: Jogador;
  mulher?: Jogador;
}

export interface ConfigSorteio {
  jogadoresPorTime: number;
  jogadoresDisponiveis: Jogador[];
  configuracoes?: {
    exigirMulherPorTime: boolean;
    exigirCabecaChavePorTime: boolean;
  };
}

export interface ResultadoSorteio {
  times: Time[];
  jogadoresNaoSorteados: Jogador[];
  configuracao: ConfigSorteio;
}
