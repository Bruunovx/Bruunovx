import React, { useEffect, useState } from 'react';
import { getDatabase, getUserProfile, addScore, sendUserNotification } from '../services/storageService';
import { SHIFTS } from '../constants';
import { Database } from '../types';
import { Community } from './Community';
import { Instagram, TrendingUp, CheckCircle2, Crown, LogOut, ExternalLink, Gift, Gavel, Bell, X, MessageCircle, LayoutDashboard } from 'lucide-react';

interface OwnerDashboardProps {
  onLogout: () => void;
}

interface AdminStats {
  username: string; // The full ID (page::user)
  realName: string;
  score: number;
  todayCount: number;
  lastReport: string;
  avatarId: string;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'community'>('overview');
  const [db, setDb] = useState<Database | null>(null);
  const [totalGold, setTotalGold] = useState(0);
  const [todayPosts, setTodayPosts] = useState(0);

  // Modal State
  const [actionType, setActionType] = useState<'gift' | 'punish' | 'notify' | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminStats | null>(null);
  const [actionValue, setActionValue] = useState(''); // Amount or Message

  const refreshData = () => {
    const database = getDatabase();
    setDb(database);
    
    let gold = 0;
    let posts = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    Object.values(database.scores).forEach(s => gold += s);
    Object.values(database.users).forEach(u => {
        if (u.history && u.history[todayStr]) {
            posts += u.history[todayStr].count;
        }
    });

    setTotalGold(gold);
    setTodayPosts(posts);
  };

  useEffect(() => {
    refreshData();
    // Auto refresh every 5s to keep overview live
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPageAdmins = (pageKey: string): AdminStats[] => {
    const adminsList = SHIFTS[pageKey];
    if (!adminsList) return []; // Should not happen if constants are correct

    const todayStr = new Date().toISOString().split('T')[0];
    const database = db || getDatabase();

    // Iterate explicitly over the SHIFTS keys to avoid duplicates
    return Object.keys(adminsList).map(adminName => {
        const uniqueId = `${pageKey}::${adminName}`;
        
        // Fetch specific user data safely
        const profile = database.users[uniqueId] || { 
            username: uniqueId, 
            nickname: adminName, 
            avatarId: '1', 
            history: {} 
        };
        const score = database.scores[uniqueId] || 0;
        const todayCount = profile.history?.[todayStr]?.count || 0;

        return {
            username: uniqueId,
            realName: adminName,
            score,
            todayCount,
            lastReport: profile.lastReportDate || 'Nunca',
            avatarId: profile.avatarId
        };
    }).sort((a, b) => b.score - a.score);
  };

  const openInstagram = (page: string) => {
    const handle = page.replace('@', '');
    window.open(`https://www.instagram.com/${handle}`, '_blank');
  };

  // --- ACTIONS LOGIC ---
  const handleActionClick = (admin: AdminStats, type: 'gift' | 'punish' | 'notify') => {
    setSelectedAdmin(admin);
    setActionType(type);
    setActionValue('');
  };

  const submitAction = () => {
    if (!selectedAdmin || !actionType) return;

    if (actionType === 'notify') {
        if (!actionValue.trim()) return alert("Digite uma mensagem.");
        sendUserNotification(selectedAdmin.username, `🔔 ADMIN: ${actionValue}`);
        alert("Notificação enviada!");
    } else {
        // Gift or Punish
        const amount = parseInt(actionValue);
        if (isNaN(amount) || amount <= 0) return alert("Digite um valor válido.");
        
        const finalAmount = actionType === 'punish' ? -amount : amount;
        addScore(selectedAdmin.username, finalAmount);
        
        // Notify them about the change
        const msg = actionType === 'punish' 
            ? `⚖️ PUNIÇÃO: Você perdeu ${amount} Gold.`
            : `🎁 PRESENTE: Você recebeu ${amount} Gold do Dono!`;
        sendUserNotification(selectedAdmin.username, msg);
        
        alert(actionType === 'punish' ? "Punição aplicada!" : "Bônus enviado!");
    }

    refreshData();
    closeModal();
  };

  const closeModal = () => {
    setActionType(null);
    setSelectedAdmin(null);
    setActionValue('');
  };

  if (!db) return null;

  // --- RENDER MODAL ---
  const renderModal = () => {
    if (!actionType || !selectedAdmin) return null;

    let title = "";
    let color = "";
    let icon = null;

    if (actionType === 'gift') {
        title = "Enviar Presente (Gold)";
        color = "bg-green-500";
        icon = <Gift size={32} className="text-white" />;
    } else if (actionType === 'punish') {
        title = "Aplicar Punição (-Gold)";
        color = "bg-red-500";
        icon = <Gavel size={32} className="text-white" />;
    } else {
        title = "Enviar Aviso";
        color = "bg-blue-500";
        icon = <Bell size={32} className="text-white" />;
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                <div className={`${color} p-4 flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                        {icon}
                        <h3 className="font-bold text-white text-lg">{title}</h3>
                    </div>
                    <button onClick={closeModal} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-4 text-sm">
                        Para: <span className="font-bold text-gray-800 capitalize">{selectedAdmin.realName}</span>
                    </p>

                    {actionType === 'notify' ? (
                        <textarea
                            value={actionValue}
                            onChange={(e) => setActionValue(e.target.value)}
                            placeholder="Digite o aviso aqui..."
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-blue-500 min-h-[100px]"
                        />
                    ) : (
                        <input 
                            type="number"
                            value={actionValue}
                            onChange={(e) => setActionValue(e.target.value)}
                            placeholder="Quantidade"
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-orange-500 text-lg font-bold"
                        />
                    )}

                    <button 
                        onClick={submitAction}
                        className={`w-full py-3 rounded-xl text-white font-bold mt-6 shadow-md active:scale-95 transition-transform ${color}`}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
        {renderModal()}

        {/* Top Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
                <h1 className="font-montserrat font-bold text-2xl text-gray-800 flex items-center gap-2">
                    Painel Mestre <Crown size={24} className="text-yellow-500 fill-yellow-500" />
                </h1>
                <p className="text-gray-400 text-xs font-semibold">Gestão Geral</p>
            </div>
            <button onClick={onLogout} className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
                <LogOut size={20} />
            </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shrink-0">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-[#C06014]' : 'text-gray-400'}`}
            >
                <LayoutDashboard size={16} />
                Gestão
            </button>
            <button 
                onClick={() => setActiveTab('community')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'community' ? 'bg-white shadow-sm text-[#C06014]' : 'text-gray-400'}`}
            >
                <MessageCircle size={16} />
                Comunidade
            </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-grow overflow-y-auto pb-20 no-scrollbar">
            
            {activeTab === 'community' ? (
                <Community username="bruunovx" />
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <TrendingUp size={16} />
                                <span className="text-[10px] font-bold uppercase">Total Gold</span>
                            </div>
                            <div className="text-2xl font-black text-[#C06014]">{totalGold.toFixed(0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <CheckCircle2 size={16} />
                                <span className="text-[10px] font-bold uppercase">Posts Hoje</span>
                            </div>
                            <div className="text-2xl font-black text-gray-800">{todayPosts}</div>
                        </div>
                    </div>

                    {/* Pages List */}
                    {Object.keys(SHIFTS).map(page => {
                        const admins = getPageAdmins(page);
                        const pagePosts = admins.reduce((acc, curr) => acc + curr.todayCount, 0);

                        return (
                            <div key={page} className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden">
                                {/* Page Header */}
                                <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Instagram className="text-[#C06014]" size={18} />
                                        <span className="font-bold text-gray-800 text-sm">{page}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400">{pagePosts} posts</span>
                                        <button 
                                            onClick={() => openInstagram(page)}
                                            className="bg-blue-50 text-blue-500 p-1.5 rounded-lg hover:bg-blue-100"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Admins List */}
                                <div className="divide-y divide-gray-50">
                                    {admins.map((admin, idx) => (
                                        <div key={admin.username} className="p-3 flex flex-col gap-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-gray-800 capitalize flex items-center gap-2">
                                                            {admin.realName}
                                                            {admin.todayCount < 5 && (
                                                                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" title="Meta pendente"></span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-medium">
                                                            {admin.todayCount}/5 posts • {admin.score.toFixed(0)} G
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleActionClick(admin, 'gift')}
                                                    className="flex-1 bg-green-50 text-green-600 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-green-100"
                                                >
                                                    <Gift size={12} /> Bônus
                                                </button>
                                                <button 
                                                    onClick={() => handleActionClick(admin, 'punish')}
                                                    className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-red-100"
                                                >
                                                    <Gavel size={12} /> Punir
                                                </button>
                                                <button 
                                                    onClick={() => handleActionClick(admin, 'notify')}
                                                    className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-blue-100"
                                                >
                                                    <Bell size={12} /> Aviso
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};