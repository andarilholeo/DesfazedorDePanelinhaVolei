# 🏐 Sorteio Vôlei

Um PWA (Progressive Web App) para sortear times de vôlei de forma inteligente, garantindo que cada time tenha exatamente 1 cabeça de chave e 1 mulher.

## ✨ Funcionalidades

- **PWA**: Funciona offline e pode ser instalado no celular
- **Gerenciamento de Jogadores**: Adicione, edite e remova jogadores
- **Sorteio Inteligente**: Algoritmo que garante distribuição equilibrada
- **Interface Responsiva**: Funciona perfeitamente em mobile e desktop
- **Dados Locais**: Usa localStorage, não precisa de servidor

## 🎯 Como Funciona

1. **Cadastre os Jogadores**: Nome, sexo e se é cabeça de chave
2. **Configure o Sorteio**: Defina quantos jogadores por time
3. **Sorteie**: O algoritmo distribui automaticamente garantindo:
   - 1 cabeça de chave por time
   - 1 mulher por time
   - Distribuição aleatória dos demais jogadores

## 🚀 Como Usar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

### Deploy na Vercel

1. Faça push do código para um repositório Git
2. Conecte o repositório na [Vercel](https://vercel.com)
3. Deploy automático será feito

### Instalação como PWA

1. Acesse o site no celular
2. No Chrome: Menu > "Adicionar à tela inicial"
3. No Safari: Compartilhar > "Adicionar à Tela de Início"

## 🎨 Paleta de Cores

- **Laranja Principal**: `#ef863d`
- **Laranja Claro**: `#f49030`
- **Creme**: `#f3f0ee`
- **Escuro**: `#3c3f4c`
- **Mais Escuro**: `#35364a`

## 🛠️ Tecnologias

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **next-pwa**: Funcionalidades PWA
- **localStorage**: Persistência de dados local

## 📱 Recursos PWA

- ✅ Funciona offline
- ✅ Instalável no celular
- ✅ Ícone personalizado
- ✅ Splash screen
- ✅ Otimizado para mobile

## 🔧 Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── lib/                # Lógica de negócio
└── types/              # Definições TypeScript
```

## 📄 Licença

Projeto desenvolvido para uso do grupo de vôlei.
