import { Database, Message, UserProfile, RankTier } from '../types';
import { INITIAL_DB, AVATARS, STORE_ITEMS, RANK_THRESHOLDS } from '../constants';
import { initializeApp } from 'firebase/app';
import { getDatabase as getFirebaseDB, ref, onValue, set, get, child, update } from 'firebase/database';
import { firebaseConfig } from '../firebaseConfig';

// --- FIREBASE SETUP ---
let app;
let db;
let GLOBAL_DB: Database = { ...INITIAL_DB }; // In-memory cache for synchronous access
let isInitialized = false;

try {
    app = initializeApp(firebaseConfig);
    db = getFirebaseDB(app);
} catch (error) {
    console.error("Firebase init error (Did you fill firebaseConfig.ts?):", error);
}

// Subscribe to Firebase changes to keep GLOBAL_DB updated
export const subscribeToDatabase = (callback: () => void) => {
    if (!db) return;
    const dbRef = ref(db, '/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            GLOBAL_DB = { ...INITIAL_DB, ...data, users: data.users || {}, messages: data.messages || [], scores: data.scores || {} };
        } else {
             // Initialize DB on cloud if empty
            set(ref(db, '/'), INITIAL_DB);
            GLOBAL_DB = { ...INITIAL_DB };
        }
        isInitialized = true;
        callback();
    });
};

export const isDatabaseReady = () => isInitialized;

// --- STORAGE FUNCTIONS (Now Hybrid: Read from Memory, Write to Cloud) ---

export const getDatabase = (): Database => {
  return GLOBAL_DB; // Returns the latest cached data
};

export const saveDatabase = (newDb: Database): void => {
  // Optimistic update (update local immediately)
  GLOBAL_DB = newDb;
  
  if (db) {
      // Async update to cloud
      update(ref(db, '/'), newDb).catch(e => console.error("Firebase Save Error:", e));
  }
};

// --- Helper Wrappers (Logic remains mostly same, just uses new saveDatabase) ---

export const addScore = (username: string, points: number): Database => {
  const currentDb = getDatabase();
  const currentScore = currentDb.scores[username] || 0;
  
  const updates: any = {};
  updates[`scores/${username}`] = currentScore + points;

  // Update local
  currentDb.scores[username] = currentScore + points;
  
  // Update cloud specific path for performance
  if(db) update(ref(db, '/'), updates);
  
  return currentDb;
};

export const addMessage = (username: string, text: string): Database => {
  const currentDb = getDatabase();
  const newMessage: Message = {
    user: username,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  // Local
  if (!currentDb.messages) currentDb.messages = [];
  const updatedMessages = [...currentDb.messages, newMessage];
  GLOBAL_DB.messages = updatedMessages;

  // Cloud
  if(db) set(ref(db, 'messages'), updatedMessages);
  
  return GLOBAL_DB;
};

export const getUserScore = (username: string): number => {
  return GLOBAL_DB.scores[username] || 0;
};

export const getPageTotalScore = (pagePrefix: string): number => {
  let total = 0;
  Object.keys(GLOBAL_DB.scores).forEach(key => {
    if (key.startsWith(pagePrefix)) {
      total += GLOBAL_DB.scores[key];
    }
  });
  return total;
};

// --- User Profile Logic ---

export const getUserProfile = (username: string): UserProfile => {
  if (GLOBAL_DB.users && GLOBAL_DB.users[username]) {
    const u = GLOBAL_DB.users[username];
    // Ensure new fields exist
    if (!u.history) u.history = {};
    if (!u.inventory) u.inventory = [];
    if (!u.equipped) u.equipped = {};
    if (!u.inbox) u.inbox = [];
    return u;
  }
  
  const defaultProfile: UserProfile = {
    username,
    nickname: username,
    avatarId: AVATARS[0].id,
    lastReportDate: '',
    history: {},
    customAvatarUrl: '',
    inventory: [],
    equipped: {},
    inbox: []
  };
  
  // We need to create it
  GLOBAL_DB.users = GLOBAL_DB.users || {};
  GLOBAL_DB.users[username] = defaultProfile;
  
  if (db) set(ref(db, `users/${username}`), defaultProfile);
  
  return defaultProfile;
};

export const updateUserProfile = (username: string, updates: Partial<UserProfile>): UserProfile => {
  const current = getUserProfile(username);
  const updated = { ...current, ...updates };
  
  GLOBAL_DB.users[username] = updated;
  if(db) update(ref(db, `users/${username}`), updates);
  
  return updated;
};

export const updateUserHistory = (username: string, date: string, count: number, bonus: number) => {
    getUserProfile(username); // ensure exists
    const path = `users/${username}/history/${date}`;
    const data = { count, bonus };

    // Local
    if(!GLOBAL_DB.users[username].history) GLOBAL_DB.users[username].history = {};
    GLOBAL_DB.users[username].history![date] = data;

    // Cloud
    if(db) set(ref(db, path), data);
};

// --- Notifications System ---

export const sendUserNotification = (username: string, message: string) => {
    // We need to fetch the array, push, and save. 
    // Since Firebase arrays are tricky with concurrent writes, we'll try to just read local and push.
    // Ideally use a push ID, but simple array for now.
    
    if (!GLOBAL_DB.users[username]) getUserProfile(username); 
    
    const user = GLOBAL_DB.users[username];
    const newInbox = [...(user.inbox || []), message];
    
    user.inbox = newInbox;
    if(db) set(ref(db, `users/${username}/inbox`), newInbox);
};

export const consumeUserNotifications = (username: string): string[] => {
    const user = GLOBAL_DB.users[username];
    if (!user || !user.inbox || user.inbox.length === 0) return [];
    
    const messages = [...user.inbox];
    user.inbox = []; // Clear local
    
    if(db) set(ref(db, `users/${username}/inbox`), []); // Clear Cloud
    
    return messages;
};

// --- Store & Rank Logic ---

export const getRankInfo = (score: number): { tier: RankTier, color: string, icon: string, value: number } => {
    if (score >= RANK_THRESHOLDS.DIAMOND) return { tier: RankTier.DIAMOND, color: 'text-cyan-500', icon: '💎', value: 4 };
    if (score >= RANK_THRESHOLDS.GOLD) return { tier: RankTier.GOLD, color: 'text-yellow-500', icon: '🥇', value: 3 };
    if (score >= RANK_THRESHOLDS.SILVER) return { tier: RankTier.SILVER, color: 'text-gray-400', icon: '🥈', value: 2 };
    if (score >= RANK_THRESHOLDS.BRONZE) return { tier: RankTier.BRONZE, color: 'text-orange-700', icon: '🥉', value: 1 };
    
    return { tier: RankTier.UNRANKED, color: 'text-gray-300', icon: '⚪', value: 0 };
};

export const purchaseItem = (username: string, itemId: string): { success: boolean; message: string } => {
    const score = GLOBAL_DB.scores[username] || 0;
    const item = STORE_ITEMS.find(i => i.id === itemId);
    const user = getUserProfile(username);
    const rankInfo = getRankInfo(score);
    
    if (!item) return { success: false, message: 'Item inválido.' };
    
    // Check Rank Requirement
    const itemRankValue = getRankValue(item.minRank);
    if (rankInfo.value < itemRankValue) {
        return { success: false, message: `Bloqueado! Requer patente ${item.minRank}.` };
    }

    if (score < item.price) return { success: false, message: `Saldo insuficiente. Faltam ${item.price - score} Gold.` };
    if (user.inventory?.includes(itemId)) return { success: false, message: 'Você já possui este item.' };

    // Deduct cost
    const newScore = score - item.price;
    GLOBAL_DB.scores[username] = newScore;
    if(db) set(ref(db, `scores/${username}`), newScore);
    
    // Add to inventory
    const newInventory = [...(user.inventory || []), itemId];
    user.inventory = newInventory;
    if(db) set(ref(db, `users/${username}/inventory`), newInventory);

    return { success: true, message: 'Item comprado com sucesso!' };
};

export const equipItem = (username: string, itemId: string) => {
    const user = GLOBAL_DB.users[username];
    if (!user.equipped) user.equipped = {};

    const newBorder = user.equipped.border === itemId ? undefined : itemId; // toggle
    user.equipped.border = newBorder;

    if(db) {
        if(newBorder) set(ref(db, `users/${username}/equipped/border`), newBorder);
        else set(ref(db, `users/${username}/equipped/border`), null);
    }
};

const getRankValue = (tier: RankTier): number => {
    switch(tier) {
        case RankTier.DIAMOND: return 4;
        case RankTier.GOLD: return 3;
        case RankTier.SILVER: return 2;
        case RankTier.BRONZE: return 1;
        default: return 0;
    }
};

// --- Penalty Logic ---
export const checkAndApplyPenalty = (username: string): boolean => {
  const user = getUserProfile(username);
  if (!user) return false;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (user.lastPenaltyCheck === todayStr) {
    return false;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const historyYesterday = user.history?.[yesterdayStr];
  
  if (!historyYesterday || historyYesterday.count < 5) {
    const PENALTY_AMOUNT = -50;
    const currentScore = GLOBAL_DB.scores[username] || 0;
    const newScore = currentScore + PENALTY_AMOUNT;
    
    GLOBAL_DB.scores[username] = newScore;
    user.lastPenaltyCheck = todayStr;
    GLOBAL_DB.users[username] = user; // updates local ref

    if(db) {
        set(ref(db, `scores/${username}`), newScore);
        update(ref(db, `users/${username}`), { lastPenaltyCheck: todayStr });
    }
    return true; 
  }

  user.lastPenaltyCheck = todayStr;
  if(db) update(ref(db, `users/${username}`), { lastPenaltyCheck: todayStr });
  
  return false;
};

export const getAvatarById = (id: string) => {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
};

export const getItemById = (id: string) => {
    return STORE_ITEMS.find(i => i.id === id);
};