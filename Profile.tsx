import React, { useState, useEffect } from 'react';
import { UserSession, UserProfile, RankTier } from '../types';
import { LogOut, Save, Upload, X, ShoppingBag, User as UserIcon, Lock } from 'lucide-react';
import { getUserProfile, updateUserProfile, getAvatarById, purchaseItem, equipItem, getUserScore, getItemById, getRankInfo } from '../services/storageService';
import { AVATARS, STORE_ITEMS } from '../constants';

interface ProfileProps {
  session: UserSession;
  onProfileUpdate: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ session, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState<'store' | 'profile'>('store');
  const [storeRankTab, setStoreRankTab] = useState<RankTier>(RankTier.BRONZE);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [nickname, setNickname] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [customImage, setCustomImage] = useState<string>('');

  const refresh = () => {
    const p = getUserProfile(session.username);
    setProfile(p);
    setNickname(p.nickname);
    setSelectedAvatarId(p.avatarId);
    setCustomImage(p.customAvatarUrl || '');
    setUserScore(getUserScore(session.username));
    onProfileUpdate(); 
  };

  useEffect(() => {
    refresh();
  }, [session.username]);

  const handleSaveProfile = () => {
    if (!nickname.trim()) return alert("O apelido não pode ser vazio");
    updateUserProfile(session.username, { 
        nickname, 
        avatarId: selectedAvatarId,
        customAvatarUrl: customImage 
    });
    refresh();
    alert("Perfil atualizado!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert("A imagem deve ter no máximo 2MB");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuy = (itemId: string) => {
    if (!confirm("Deseja comprar esta borda?")) return;
    const result = purchaseItem(session.username, itemId);
    if (result.success) {
        alert(result.message);
        refresh();
    } else {
        alert(result.message);
    }
  };

  const handleEquip = (itemId: string) => {
    equipItem(session.username, itemId);
    refresh();
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
        window.location.reload();
    }
  };

  if (!profile) return null;

  const currentRankInfo = getRankInfo(userScore);
  const rankValue = currentRankInfo.value;

  const renderStore = () => (
      <div className="flex flex-col gap-6 pb-20">
          <div className="bg-gradient-to-r from-[#C06014] to-orange-400 p-4 rounded-xl text-white flex justify-between items-center shadow-lg">
              <div>
                  <span className="text-xs opacity-80 uppercase font-bold">Saldo Disponível</span>
                  <div className="text-3xl font-bold">{userScore.toFixed(1)} <span className="text-lg">💰</span></div>
                  <div className="text-xs font-bold mt-1 bg-white/20 px-2 py-1 rounded inline-block">
                    Rank Atual: {currentRankInfo.tier} {currentRankInfo.icon}
                  </div>
              </div>
              <ShoppingBag size={32} className="opacity-50" />
          </div>

          {/* Rank Tabs */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
            {[RankTier.BRONZE, RankTier.SILVER, RankTier.GOLD, RankTier.DIAMOND].map(tier => {
                let colorClass = 'text-gray-500 bg-gray-100';
                if (tier === RankTier.BRONZE) colorClass = 'text-orange-700 bg-orange-100';
                if (tier === RankTier.SILVER) colorClass = 'text-slate-600 bg-slate-200';
                if (tier === RankTier.GOLD) colorClass = 'text-yellow-700 bg-yellow-100';
                if (tier === RankTier.DIAMOND) colorClass = 'text-cyan-700 bg-cyan-100';

                const isActive = storeRankTab === tier;

                return (
                    <button
                        key={tier}
                        onClick={() => setStoreRankTab(tier)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${isActive ? 'ring-2 ring-offset-1 ring-[#C06014]' : 'opacity-60'} ${colorClass}`}
                    >
                        {tier}
                    </button>
                );
            })}
          </div>

          {/* Items Grid */}
          <div>
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                Bordas: {storeRankTab}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                  {STORE_ITEMS.filter(i => i.minRank === storeRankTab).map(item => {
                      const owned = profile.inventory?.includes(item.id);
                      const equipped = profile.equipped?.border === item.id;
                      
                      // Lock Logic
                      let isLocked = false;
                      let requiredVal = 0;
                      if (item.minRank === RankTier.SILVER) requiredVal = 2;
                      if (item.minRank === RankTier.GOLD) requiredVal = 3;
                      if (item.minRank === RankTier.DIAMOND) requiredVal = 4;
                      // Bronze (1) is always unlocked if rank >= 0? No, needs score > 0
                      if (item.minRank === RankTier.BRONZE) requiredVal = 1;

                      if (rankValue < requiredVal) isLocked = true;

                      return (
                        <div key={item.id} className={`bg-white p-3 rounded-xl border ${isLocked ? 'border-gray-200 bg-gray-50' : 'border-gray-100'} shadow-sm flex flex-col items-center text-center relative overflow-hidden transition-all`}>
                            
                            {isLocked && (
                                <div className="absolute inset-0 bg-gray-100/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                    <Lock size={24} className="text-gray-400" />
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-full bg-gray-100 mb-2 ${item.cssClass}`}></div>
                            <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 mb-2 leading-tight">{item.description}</p>
                            
                            {owned ? (
                                <button 
                                    onClick={() => handleEquip(item.id)}
                                    className={`w-full py-1.5 rounded-lg text-xs font-bold ${equipped ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {equipped ? 'Equipado' : 'Equipar'}
                                </button>
                            ) : (
                                <button 
                                    onClick={() => !isLocked && handleBuy(item.id)}
                                    disabled={isLocked}
                                    className={`w-full py-1.5 rounded-lg text-white text-xs font-bold active:scale-95 flex items-center justify-center gap-1 ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C06014]'}`}
                                >
                                    {isLocked ? 'Bloqueado' : `${item.price} G`}
                                </button>
                            )}
                        </div>
                      );
                  })}
              </div>
          </div>
      </div>
  );

  const renderProfileSettings = () => (
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 pb-20">
        
        {/* Avatar View with Equipped Items */}
        <div className="flex flex-col items-center mb-4">
             <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${!customImage ? getAvatarById(selectedAvatarId).bg : 'bg-gray-50'} ${profile.equipped?.border ? getItemById(profile.equipped.border)?.cssClass : 'border-4 border-white shadow-lg'}`}>
                {customImage ? (
                    <img src={customImage} alt="Custom" className="w-full h-full object-cover rounded-full" />
                ) : (
                    <div className="text-4xl">{getAvatarById(selectedAvatarId).icon}</div>
                )}
            </div>
            <span className="mt-2 text-xs font-bold text-gray-400 uppercase">Visual Atual</span>
            <span className="text-[10px] text-gray-300">
               {profile.equipped?.border ? getItemById(profile.equipped.border)?.name : 'Sem Borda'}
            </span>
        </div>

        {/* Upload */}
        <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-3">Alterar Foto</label>
            <div className="flex items-center gap-2">
                <label className="bg-[#FFF5EB] text-[#C06014] px-4 py-3 rounded-xl text-sm font-bold cursor-pointer flex-grow text-center hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                    <Upload size={16} />
                    Carregar Foto
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {customImage && (
                    <button 
                        onClick={() => setCustomImage('')}
                        className="bg-red-50 text-red-500 p-3 rounded-xl"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>

        {/* Avatar Selector */}
        {!customImage && (
            <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-3">Ou escolha um Avatar</label>
            <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((av) => (
                    <button
                    key={av.id}
                    onClick={() => setSelectedAvatarId(av.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                        selectedAvatarId === av.id 
                        ? 'border-2 border-[#C06014] scale-110 shadow-md bg-white' 
                        : `${av.bg} border border-transparent opacity-70 hover:opacity-100`
                    }`}
                    >
                    {av.icon}
                    </button>
                ))}
            </div>
            </div>
        )}

        {/* Nickname Input */}
        <div>
          <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Seu Apelido</label>
          <input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-[#F8F9FA] text-base focus:border-[#C06014] focus:outline-none"
            placeholder="Como você quer ser chamado?"
          />
        </div>

        <button 
          onClick={handleSaveProfile}
          className="w-full py-4 rounded-xl bg-[#C06014] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/10 active:scale-95 transition-all"
        >
          <Save size={18} />
          Salvar
        </button>

        <div className="h-px bg-gray-100 my-2"></div>

        <button 
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-gray-50 text-gray-500 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
  );

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <button 
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'store' ? 'bg-white shadow-sm text-[#C06014]' : 'text-gray-400 hover:bg-white/50'}`}
        >
            <div className="flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                Loja de Bordas
            </div>
        </button>
        <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm text-[#C06014]' : 'text-gray-400 hover:bg-white/50'}`}
        >
             <div className="flex items-center justify-center gap-2">
                <UserIcon size={16} />
                Meu Perfil
            </div>
        </button>
      </div>
      
      {activeTab === 'store' ? renderStore() : renderProfileSettings()}
    </>
  );
};