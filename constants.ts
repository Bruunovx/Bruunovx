import { ShiftMap, AvatarOption, StoreItem, RankTier } from './types';

export const PRIMARY_COLOR = '#C06014';
export const STORAGE_KEY = 'MANAGER_V10_LIGHT_REACT';

export const IG_OPTIONS = [
  '@perolas.ccb',
  '@influencers.ccb',
  '@ccbprincesas'
];

export const SHIFTS: ShiftMap = {
  "@ccbprincesas": {
    "gabriela": "08:00",
    "heloisa": "09:00",
    "leticia": "14:00",
    "letícia": "14:00",
    "marjory": "15:00",
    "vittoria": "20:00"
  },
  "@influencers.ccb": {
    "rafaela": "08:00",
    "ana júlia": "09:00",
    "ana julia": "09:00",
    "anny": "14:00",
    "camille": "15:00",
    "rebeka": "20:00",
    "aghatha": "21:00"
  },
  "@perolas.ccb": {
    "stephenie": "14:00",
    "thayssa": "15:00",
    "gabrielly": "19:00",
    "leticia": "20:00",
    "letícia": "20:00",
    "aghatha": "21:00"
  }
};

export const AVATARS: AvatarOption[] = [
  { id: '1', icon: '👩', bg: 'bg-pink-100' },
  { id: '2', icon: '👧', bg: 'bg-purple-100' },
  { id: '3', icon: '👱‍♀️', bg: 'bg-yellow-100' },
  { id: '4', icon: '👩‍🦰', bg: 'bg-orange-100' },
  { id: '5', icon: '👩‍🦱', bg: 'bg-stone-100' },
  { id: '6', icon: '👸', bg: 'bg-rose-100' },
  { id: '7', icon: '👰', bg: 'bg-blue-100' },
  { id: '8', icon: '🧜‍♀️', bg: 'bg-cyan-100' },
  { id: '9', icon: '🧚‍♀️', bg: 'bg-green-100' },
  { id: '10', icon: '🙅‍♀️', bg: 'bg-red-100' },
  { id: '11', icon: '💁‍♀️', bg: 'bg-indigo-100' },
  { id: '12', icon: '🧛‍♀️', bg: 'bg-gray-100' },
];

export const INITIAL_DB = {
  scores: {},
  messages: [],
  users: {}
};

// --- RANK SYSTEM ---
export const RANK_THRESHOLDS = {
    BRONZE: 1,      // Starts after first point
    SILVER: 500,
    GOLD: 2000,
    DIAMOND: 5000
};

// --- STORE CATALOG (100 Unique Borders) ---
export const STORE_ITEMS: StoreItem[] = [
    // ========================================================================
    // BRONZE TIER (Rústico, Natureza, Vintage, Tons Terrosos)
    // ========================================================================
    { id: 'br_1', type: 'border', minRank: RankTier.BRONZE, name: 'Iniciante', description: 'Borda simples de cobre.', price: 50, cssClass: 'ring-4 ring-orange-900' },
    { id: 'br_2', type: 'border', minRank: RankTier.BRONZE, name: 'Corda', description: 'Estilo rústico trançado.', price: 100, cssClass: 'border-4 border-dashed border-amber-800' },
    { id: 'br_3', type: 'border', minRank: RankTier.BRONZE, name: 'Madeira Nobre', description: 'Acabamento em mogno.', price: 150, cssClass: 'ring-4 ring-[#451a03] border-4 border-[#78350f]' },
    { id: 'br_4', type: 'border', minRank: RankTier.BRONZE, name: 'Café Expresso', description: 'Energia escura.', price: 200, cssClass: 'ring-2 ring-stone-900 ring-offset-4 ring-offset-[#3f2e18]' },
    { id: 'br_5', type: 'border', minRank: RankTier.BRONZE, name: 'Tijolinho', description: 'Sólido como rocha.', price: 220, cssClass: 'border-[6px] border-dashed border-red-900' },
    { id: 'br_6', type: 'border', minRank: RankTier.BRONZE, name: 'Argila', description: 'Feito à mão.', price: 250, cssClass: 'bg-orange-200 p-1 ring-4 ring-orange-400' },
    { id: 'br_7', type: 'border', minRank: RankTier.BRONZE, name: 'Vintage', description: 'Foto antiga.', price: 280, cssClass: 'ring-4 ring-sepia-500 shadow-[inset_0_0_10px_rgba(100,50,0,0.5)] bg-[#fdf6e3] p-1' },
    { id: 'br_8', type: 'border', minRank: RankTier.BRONZE, name: 'Pergaminho', description: 'História antiga.', price: 300, cssClass: 'border-double border-8 border-[#d4c5a3]' },
    { id: 'br_9', type: 'border', minRank: RankTier.BRONZE, name: 'Espinhos', description: 'Cuidado!', price: 320, cssClass: 'ring-2 ring-red-900 border-2 border-dotted border-red-500 p-0.5' },
    { id: 'br_10', type: 'border', minRank: RankTier.BRONZE, name: 'Tribal', description: 'Marcas antigas.', price: 350, cssClass: 'border-4 border-dotted border-stone-600 ring-2 ring-stone-400' },
    { id: 'br_11', type: 'border', minRank: RankTier.BRONZE, name: 'Outono', description: 'Folhas secas.', price: 380, cssClass: 'ring-4 ring-orange-600 border-t-4 border-b-4 border-t-yellow-600 border-b-red-700' },
    { id: 'br_12', type: 'border', minRank: RankTier.BRONZE, name: 'Couro', description: 'Costura firme.', price: 400, cssClass: 'ring-4 ring-yellow-900 border-dashed border-2 border-yellow-600' },
    { id: 'br_13', type: 'border', minRank: RankTier.BRONZE, name: 'Chocolate', description: 'Doce.', price: 410, cssClass: 'ring-8 ring-[#2b1810] border-2 border-[#5c3a2e]' },
    { id: 'br_14', type: 'border', minRank: RankTier.BRONZE, name: 'Guerreiro', description: 'Marcas de batalha.', price: 420, cssClass: 'border-l-4 border-r-4 border-red-900 ring-2 ring-gray-600' },
    { id: 'br_15', type: 'border', minRank: RankTier.BRONZE, name: 'Raízes', description: 'Conexão com a terra.', price: 430, cssClass: 'ring-2 ring-green-900 border-4 border-dotted border-green-800' },
    { id: 'br_16', type: 'border', minRank: RankTier.BRONZE, name: 'Areia', description: 'Deserto.', price: 440, cssClass: 'ring-4 ring-[#e6ccb2] shadow-sm' },
    { id: 'br_17', type: 'border', minRank: RankTier.BRONZE, name: 'Terracota', description: 'Cerâmica.', price: 450, cssClass: 'bg-[#dd6e42] p-1.5 ring-2 ring-white' },
    { id: 'br_18', type: 'border', minRank: RankTier.BRONZE, name: 'Fogueira', description: 'Quente.', price: 460, cssClass: 'ring-4 ring-orange-500 shadow-[0_0_10px_orange]' },
    { id: 'br_19', type: 'border', minRank: RankTier.BRONZE, name: 'Bambu', description: 'Zen.', price: 470, cssClass: 'border-double border-4 border-green-700 ring-2 ring-green-100' },
    { id: 'br_20', type: 'border', minRank: RankTier.BRONZE, name: 'Lata Velha', description: 'Charme industrial.', price: 480, cssClass: 'ring-4 ring-gray-500 border-dashed border-gray-700' },
    { id: 'br_21', type: 'border', minRank: RankTier.BRONZE, name: 'Bússola', description: 'Explorador.', price: 485, cssClass: 'border-4 border-blue-900 ring-2 ring-amber-500' },
    { id: 'br_22', type: 'border', minRank: RankTier.BRONZE, name: 'Mapa', description: 'Tesouro escondido.', price: 490, cssClass: 'p-1 bg-[#f4e4bc] border border-dashed border-black' },
    { id: 'br_23', type: 'border', minRank: RankTier.BRONZE, name: 'Moldura', description: 'Clássico.', price: 495, cssClass: 'ring-[6px] ring-stone-300 ring-inset border-4 border-stone-500' },
    { id: 'br_24', type: 'border', minRank: RankTier.BRONZE, name: 'Cobre Polido', description: 'Brilhante.', price: 499, cssClass: 'ring-2 ring-orange-300 ring-offset-2 ring-offset-orange-700' },
    { id: 'br_25', type: 'border', minRank: RankTier.BRONZE, name: 'Fóssil', description: 'Pré-histórico.', price: 500, cssClass: 'ring-4 ring-stone-400 border-4 border-stone-600 border-dotted' },

    // ========================================================================
    // SILVER TIER (Metálico, Gelo, Elegante, Minimalista)
    // ========================================================================
    { id: 'sl_1', type: 'border', minRank: RankTier.SILVER, name: 'Aço Puro', description: 'Resistente.', price: 600, cssClass: 'ring-4 ring-slate-400 shadow-md' },
    { id: 'sl_2', type: 'border', minRank: RankTier.SILVER, name: 'Pérola', description: 'Delicado.', price: 650, cssClass: 'border-4 border-dotted border-slate-200 ring-2 ring-slate-100 shadow-sm' },
    { id: 'sl_3', type: 'border', minRank: RankTier.SILVER, name: 'Lâmina', description: 'Corte rápido.', price: 700, cssClass: 'border-t-4 border-b-4 border-slate-700 ring-1 ring-gray-300' },
    { id: 'sl_4', type: 'border', minRank: RankTier.SILVER, name: 'Iceberg', description: 'Congelante.', price: 750, cssClass: 'ring-4 ring-cyan-100 shadow-[0_0_10px_cyan] border-2 border-white' },
    { id: 'sl_5', type: 'border', minRank: RankTier.SILVER, name: 'Nuvem', description: 'Leveza.', price: 800, cssClass: 'ring-8 ring-blue-50 opacity-80 blur-[1px]' },
    { id: 'sl_6', type: 'border', minRank: RankTier.SILVER, name: 'Tech', description: 'Futurista.', price: 850, cssClass: 'border-2 border-blue-400 ring-2 ring-offset-2 ring-slate-800' },
    { id: 'sl_7', type: 'border', minRank: RankTier.SILVER, name: 'Fantasma', description: 'Assustador.', price: 900, cssClass: 'ring-4 ring-gray-200 opacity-60 shadow-[0_0_20px_white]' },
    { id: 'sl_8', type: 'border', minRank: RankTier.SILVER, name: 'Cota de Malha', description: 'Medieval.', price: 950, cssClass: 'border-4 border-double border-gray-500 ring-1 ring-black' },
    { id: 'sl_9', type: 'border', minRank: RankTier.SILVER, name: 'Cromado', description: 'Reflexivo.', price: 1000, cssClass: 'p-1 bg-gradient-to-tr from-gray-300 via-white to-gray-300' },
    { id: 'sl_10', type: 'border', minRank: RankTier.SILVER, name: 'Estrela', description: 'Pontudo.', price: 1100, cssClass: 'ring-2 ring-blue-200 border-2 border-dashed border-blue-400' },
    { id: 'sl_11', type: 'border', minRank: RankTier.SILVER, name: 'Oceano', description: 'Profundo.', price: 1200, cssClass: 'ring-4 ring-blue-700 shadow-[inset_0_0_10px_blue]' },
    { id: 'sl_12', type: 'border', minRank: RankTier.SILVER, name: 'Lunar', description: 'Crateras.', price: 1250, cssClass: 'border-4 border-dotted border-gray-300 bg-gray-100 p-1' },
    { id: 'sl_13', type: 'border', minRank: RankTier.SILVER, name: 'Espelho', description: 'Reflexo puro.', price: 1300, cssClass: 'ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border border-gray-200' },
    { id: 'sl_14', type: 'border', minRank: RankTier.SILVER, name: 'Diamante Bruto', description: 'Sem lapidação.', price: 1350, cssClass: 'border-[5px] border-cyan-100 ring-1 ring-cyan-500' },
    { id: 'sl_15', type: 'border', minRank: RankTier.SILVER, name: 'Vento Norte', description: 'Rápido.', price: 1400, cssClass: 'border-r-4 border-l-4 border-cyan-200 ring-2 ring-transparent' },
    { id: 'sl_16', type: 'border', minRank: RankTier.SILVER, name: 'Platina', description: 'Valioso.', price: 1500, cssClass: 'ring-4 ring-slate-300 ring-offset-2 ring-offset-slate-100' },
    { id: 'sl_17', type: 'border', minRank: RankTier.SILVER, name: 'Neve', description: 'Flocos.', price: 1550, cssClass: 'border-4 border-dotted border-white ring-2 ring-blue-100 bg-blue-50 p-0.5' },
    { id: 'sl_18', type: 'border', minRank: RankTier.SILVER, name: 'Titânio', description: 'Indestrutível.', price: 1600, cssClass: 'ring-[6px] ring-slate-600 border-2 border-slate-400' },
    { id: 'sl_19', type: 'border', minRank: RankTier.SILVER, name: 'Robô', description: 'Bip Bop.', price: 1650, cssClass: 'border-t-4 border-slate-800 border-b-4 border-red-500 ring-2 ring-slate-300' },
    { id: 'sl_20', type: 'border', minRank: RankTier.SILVER, name: 'Sombra', description: 'Furtivo.', price: 1700, cssClass: 'ring-4 ring-black opacity-30 blur-sm' },
    { id: 'sl_21', type: 'border', minRank: RankTier.SILVER, name: 'Cristal', description: 'Transparente.', price: 1750, cssClass: 'ring-4 ring-white/50 border-2 border-white shadow-lg' },
    { id: 'sl_22', type: 'border', minRank: RankTier.SILVER, name: 'Mercúrio Líquido', description: 'Fluido.', price: 1800, cssClass: 'bg-slate-200 p-1 ring-2 ring-slate-400 rounded-[30%]' },
    { id: 'sl_23', type: 'border', minRank: RankTier.SILVER, name: 'Raio', description: 'Elétrico.', price: 1850, cssClass: 'ring-2 ring-yellow-200 shadow-[0_0_10px_yellow] border-2 border-dashed border-white' },
    { id: 'sl_24', type: 'border', minRank: RankTier.SILVER, name: 'Viking', description: 'Nórdico.', price: 1900, cssClass: 'ring-4 ring-slate-500 border-4 border-sky-800' },
    { id: 'sl_25', type: 'border', minRank: RankTier.SILVER, name: 'Guardião Prata', description: 'Elite.', price: 1999, cssClass: 'ring-[5px] ring-slate-200 shadow-[0_0_20px_gray] border-2 border-white' },

    // ========================================================================
    // GOLD TIER (Luxo, Brilho, Realeza, Cores Quentes)
    // ========================================================================
    { id: 'gl_1', type: 'border', minRank: RankTier.GOLD, name: 'Ouro Maciço', description: 'Peso puro.', price: 2100, cssClass: 'ring-[6px] ring-yellow-500' },
    { id: 'gl_2', type: 'border', minRank: RankTier.GOLD, name: 'Dupla Honra', description: 'Dois anéis.', price: 2200, cssClass: 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-yellow-600' },
    { id: 'gl_3', type: 'border', minRank: RankTier.GOLD, name: 'Sol Nascente', description: 'Esperança.', price: 2300, cssClass: 'p-1 bg-gradient-to-t from-red-500 to-yellow-400' },
    { id: 'gl_4', type: 'border', minRank: RankTier.GOLD, name: 'Coroa Real', description: 'Para reis.', price: 2400, cssClass: 'border-t-[6px] border-yellow-500 ring-4 ring-yellow-300' },
    { id: 'gl_5', type: 'border', minRank: RankTier.GOLD, name: 'Mel Dourado', description: 'Doce.', price: 2500, cssClass: 'ring-4 ring-amber-400 bg-amber-100 p-1 border-2 border-white' },
    { id: 'gl_6', type: 'border', minRank: RankTier.GOLD, name: 'Girassol', description: 'Floral.', price: 2600, cssClass: 'border-[6px] border-dotted border-yellow-500 ring-2 ring-green-600' },
    { id: 'gl_7', type: 'border', minRank: RankTier.GOLD, name: 'Tigre', description: 'Selvagem.', price: 2700, cssClass: 'p-1 bg-gradient-to-tr from-orange-500 via-black to-orange-500' },
    { id: 'gl_8', type: 'border', minRank: RankTier.GOLD, name: 'Egito', description: 'Faraó.', price: 2800, cssClass: 'ring-4 ring-blue-600 border-4 border-yellow-500' },
    { id: 'gl_9', type: 'border', minRank: RankTier.GOLD, name: 'Luz Sagrada', description: 'Divino.', price: 2900, cssClass: 'ring-2 ring-white shadow-[0_0_25px_gold]' },
    { id: 'gl_10', type: 'border', minRank: RankTier.GOLD, name: 'Moeda Antiga', description: 'Riqueza.', price: 3000, cssClass: 'border-[4px] border-dashed border-yellow-700 ring-4 ring-yellow-600' },
    { id: 'gl_11', type: 'border', minRank: RankTier.GOLD, name: 'Chamas', description: 'Quente.', price: 3100, cssClass: 'ring-4 ring-orange-500 shadow-[0_0_15px_red] bg-red-500 p-0.5' },
    { id: 'gl_12', type: 'border', minRank: RankTier.GOLD, name: 'Outubro Rosa', description: 'Especial.', price: 3200, cssClass: 'ring-4 ring-pink-400 border-2 border-white shadow-md' },
    { id: 'gl_13', type: 'border', minRank: RankTier.GOLD, name: 'Ostentação', description: 'Bring Bring.', price: 3300, cssClass: 'ring-[8px] ring-yellow-300 border-2 border-black' },
    { id: 'gl_14', type: 'border', minRank: RankTier.GOLD, name: 'Leão', description: 'O Rei.', price: 3400, cssClass: 'border-4 border-orange-800 ring-4 ring-yellow-600' },
    { id: 'gl_15', type: 'border', minRank: RankTier.GOLD, name: 'Anjo', description: 'Asas.', price: 3500, cssClass: 'ring-4 ring-yellow-100 shadow-[0_0_20px_white] border-2 border-yellow-200' },
    { id: 'gl_16', type: 'border', minRank: RankTier.GOLD, name: 'Abelha', description: 'Trabalhadora.', price: 3600, cssClass: 'border-4 border-dashed border-black ring-4 ring-yellow-400' },
    { id: 'gl_17', type: 'border', minRank: RankTier.GOLD, name: 'Por do Sol', description: 'Romântico.', price: 3700, cssClass: 'p-1 bg-gradient-to-b from-purple-500 to-orange-500' },
    { id: 'gl_18', type: 'border', minRank: RankTier.GOLD, name: 'Outono Dourado', description: 'Folhas.', price: 3800, cssClass: 'ring-4 ring-red-400 border-4 border-yellow-400' },
    { id: 'gl_19', type: 'border', minRank: RankTier.GOLD, name: 'Medalha', description: 'Vencedor.', price: 3900, cssClass: 'ring-[5px] ring-yellow-600 border-b-8 border-red-600' },
    { id: 'gl_20', type: 'border', minRank: RankTier.GOLD, name: 'Topázio', description: 'Pedra preciosa.', price: 4000, cssClass: 'border-[6px] border-amber-500 ring-1 ring-white' },
    { id: 'gl_21', type: 'border', minRank: RankTier.GOLD, name: 'Champagne', description: 'Celebração.', price: 4100, cssClass: 'ring-2 ring-yellow-100 border-4 border-dotted border-yellow-300' },
    { id: 'gl_22', type: 'border', minRank: RankTier.GOLD, name: 'Pirata', description: 'Ouro roubado.', price: 4200, cssClass: 'ring-4 ring-yellow-600 border-dashed border-black border-2' },
    { id: 'gl_23', type: 'border', minRank: RankTier.GOLD, name: 'Divindade', description: 'Aura.', price: 4300, cssClass: 'ring-[10px] ring-yellow-500/30 border-2 border-yellow-500' },
    { id: 'gl_24', type: 'border', minRank: RankTier.GOLD, name: 'Grifinória', description: 'Coragem.', price: 4400, cssClass: 'border-l-4 border-r-4 border-red-700 ring-4 ring-yellow-500' },
    { id: 'gl_25', type: 'border', minRank: RankTier.GOLD, name: 'Imperador', description: 'Supremo.', price: 4999, cssClass: 'p-[3px] bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-300 shadow-xl' },

    // ========================================================================
    // DIAMOND TIER (RGB, Neon, Efeitos Especiais, Mágico)
    // ========================================================================
    { id: 'dm_1', type: 'border', minRank: RankTier.DIAMOND, name: 'Diamante Azul', description: 'Clássico.', price: 5500, cssClass: 'ring-4 ring-cyan-400 shadow-[0_0_20px_cyan]' },
    { id: 'dm_2', type: 'border', minRank: RankTier.DIAMOND, name: 'Unicórnio', description: 'Mágico.', price: 6000, cssClass: 'p-1 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300' },
    { id: 'dm_3', type: 'border', minRank: RankTier.DIAMOND, name: 'Cyberpunk', description: '2077.', price: 6500, cssClass: 'border-l-4 border-r-4 border-yellow-400 ring-4 ring-cyan-600' },
    { id: 'dm_4', type: 'border', minRank: RankTier.DIAMOND, name: 'Matrix', description: 'O código.', price: 7000, cssClass: 'ring-2 ring-green-500 border-dashed border-2 border-black shadow-[0_0_10px_green] bg-black p-0.5' },
    { id: 'dm_5', type: 'border', minRank: RankTier.DIAMOND, name: 'Lava', description: 'Derretendo.', price: 7500, cssClass: 'ring-4 ring-red-600 border-t-4 border-yellow-400 shadow-[0_0_15px_orange]' },
    { id: 'dm_6', type: 'border', minRank: RankTier.DIAMOND, name: 'Galáxia', description: 'Espaço.', price: 8000, cssClass: 'p-1 bg-gradient-to-tr from-indigo-900 via-purple-800 to-pink-600 shadow-lg' },
    { id: 'dm_7', type: 'border', minRank: RankTier.DIAMOND, name: 'Glitch', description: 'Er#r0.', price: 8500, cssClass: 'ring-2 ring-red-500 ring-offset-2 ring-offset-cyan-500' },
    { id: 'dm_8', type: 'border', minRank: RankTier.DIAMOND, name: 'Vampiro', description: 'Sangue.', price: 9000, cssClass: 'ring-4 ring-red-900 shadow-[inset_0_0_20px_red]' },
    { id: 'dm_9', type: 'border', minRank: RankTier.DIAMOND, name: 'Radioativo', description: 'Perigo.', price: 9500, cssClass: 'ring-4 ring-green-400 border-4 border-black border-dashed animate-pulse' },
    { id: 'dm_10', type: 'border', minRank: RankTier.DIAMOND, name: 'Arco-Íris', description: 'Todas as cores.', price: 10000, cssClass: 'p-[4px] bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
    { id: 'dm_11', type: 'border', minRank: RankTier.DIAMOND, name: 'Buraco Negro', description: 'Evento.', price: 10500, cssClass: 'ring-4 ring-black shadow-[0_0_25px_purple] border-2 border-white' },
    { id: 'dm_12', type: 'border', minRank: RankTier.DIAMOND, name: 'Ametista', description: 'Cristal Roxo.', price: 11000, cssClass: 'border-[6px] border-purple-500 ring-1 ring-white shadow-[0_0_15px_purple]' },
    { id: 'dm_13', type: 'border', minRank: RankTier.DIAMOND, name: 'Holográfico', description: 'Prata RGB.', price: 11500, cssClass: 'ring-4 ring-gray-200 shadow-[0_0_15px_rgba(255,0,255,0.5)]' },
    { id: 'dm_14', type: 'border', minRank: RankTier.DIAMOND, name: 'Veneno', description: 'Tóxico.', price: 12000, cssClass: 'ring-4 ring-purple-600 border-4 border-dotted border-green-500' },
    { id: 'dm_15', type: 'border', minRank: RankTier.DIAMOND, name: 'Fada', description: 'Pó mágico.', price: 12500, cssClass: 'ring-2 ring-pink-200 shadow-[0_0_20px_pink] border-2 border-dotted border-white' },
    { id: 'dm_16', type: 'border', minRank: RankTier.DIAMOND, name: 'Boreal', description: 'Luzes do norte.', price: 13000, cssClass: 'p-1 bg-gradient-to-r from-green-300 to-blue-500 blur-[0.5px]' },
    { id: 'dm_17', type: 'border', minRank: RankTier.DIAMOND, name: 'Sereia', description: 'Escamas.', price: 13500, cssClass: 'ring-4 ring-teal-400 border-4 border-purple-400' },
    { id: 'dm_18', type: 'border', minRank: RankTier.DIAMOND, name: 'K-Pop', description: 'Estilo.', price: 14000, cssClass: 'ring-4 ring-pink-500 border-black border-2 shadow-[5px_5px_0px_black]' },
    { id: 'dm_19', type: 'border', minRank: RankTier.DIAMOND, name: 'Portal', description: 'Outro mundo.', price: 14500, cssClass: 'ring-[6px] ring-orange-500 shadow-[inset_0_0_15px_blue]' },
    { id: 'dm_20', type: 'border', minRank: RankTier.DIAMOND, name: 'Dragão', description: 'Escamas fogo.', price: 15000, cssClass: 'border-t-4 border-red-600 border-b-4 border-red-600 ring-4 ring-orange-500' },
    { id: 'dm_21', type: 'border', minRank: RankTier.DIAMOND, name: 'Laser', description: 'Foco.', price: 16000, cssClass: 'ring-1 ring-red-500 shadow-[0_0_20px_red] border border-white' },
    { id: 'dm_22', type: 'border', minRank: RankTier.DIAMOND, name: 'Spirit', description: 'Alma.', price: 17000, cssClass: 'ring-4 ring-cyan-200 opacity-70 shadow-[0_0_30px_cyan] animate-pulse' },
    { id: 'dm_23', type: 'border', minRank: RankTier.DIAMOND, name: 'Multiverso', description: 'Caos.', price: 18000, cssClass: 'border-l-4 border-purple-600 border-r-4 border-green-600 ring-2 ring-black' },
    { id: 'dm_24', type: 'border', minRank: RankTier.DIAMOND, name: 'Deusa', description: 'Suprema.', price: 19000, cssClass: 'p-1 bg-gradient-to-b from-white via-yellow-200 to-white shadow-[0_0_25px_white]' },
    { id: 'dm_25', type: 'border', minRank: RankTier.DIAMOND, name: 'Dona do App', description: 'Inatingível.', price: 50000, cssClass: 'ring-[8px] ring-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-border animate-spin-slow shadow-2xl' },
];