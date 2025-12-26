import React, { useState, useEffect } from 'react';
import { addScore, getUserProfile, updateUserProfile, updateUserHistory } from '../services/storageService';
import { Gift, CheckCircle2, Lock } from 'lucide-react';

interface DashboardProps {
  username: string;
  onUpdateScore: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ username, onUpdateScore }) => {
  const [dailyCount, setDailyCount] = useState(0);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGiftIndex, setSelectedGiftIndex] = useState<number | null>(null);
  const [rewardResult, setRewardResult] = useState<{ base: number, bonus: number } | null>(null);

  useEffect(() => {
    const profile = getUserProfile(username);
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastReportDate === today) {
      setHasSubmittedToday(true);
    }
  }, [username]);

  const changeCount = (val: number) => {
    if (hasSubmittedToday) return;
    const newValue = dailyCount + val;
    // Limit between 0 and 5
    if (newValue < 0 || newValue > 5) return;
    setDailyCount(newValue);
  };

  const handleInitialSubmit = () => {
    if (dailyCount === 0) return alert("Adicione pelo menos 1 post.");
    if (hasSubmittedToday) return;
    
    // Open Gift Selection
    setShowGiftModal(true);
  };

  const calculateBonus = () => {
    const rand = Math.random() * 100;
    let bonus = 0;

    // 80% chance: 0.1 to 4.0
    if (rand < 80) {
      bonus = 0.1 + (Math.random() * 3.9);
    } 
    // 17% chance: 5.0 to 6.0
    else if (rand < 97) {
      bonus = 5.0 + (Math.random() * 1.0);
    } 
    // 3% chance: 7.0 to 10.0
    else {
      bonus = 7.0 + (Math.random() * 3.0);
    }

    return parseFloat(bonus.toFixed(1));
  };

  const openGift = (index: number) => {
    if (selectedGiftIndex !== null) return; // Prevent double click
    setSelectedGiftIndex(index);

    const baseReward = dailyCount * 2; // 2 coins per post
    const bonusReward = calculateBonus();

    setTimeout(() => {
      setRewardResult({ base: baseReward, bonus: bonusReward });
      
      const today = new Date().toISOString().split('T')[0];
      
      // Save global score
      const total = baseReward + bonusReward;
      addScore(username, total);
      
      // Save last report date
      updateUserProfile(username, { lastReportDate: today });
      
      // Save History detail
      updateUserHistory(username, today, dailyCount, bonusReward);
      
      onUpdateScore();
      setHasSubmittedToday(true);
    }, 1000); // Animation delay
  };

  const closeGiftModal = () => {
    setShowGiftModal(false);
    setSelectedGiftIndex(null);
    setRewardResult(null);
    setDailyCount(0);
  };

  // Visual Logic
  const maxPosts = 5;
  const progressPercent = (dailyCount / maxPosts) * 100;
  
  let progressGradient = 'from-gray-300 to-gray-400';
  
  if (dailyCount > 0 && dailyCount <= 2) {
    progressGradient = 'from-red-400 to-red-600';
  } else if (dailyCount > 2 && dailyCount < 5) {
    progressGradient = 'from-orange-400 to-orange-500';
  } else if (dailyCount >= 5) {
    progressGradient = 'from-green-400 to-green-600';
  }

  return (
    <>
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 animate-fade-in relative overflow-hidden">
        
        {hasSubmittedToday && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 size={48} className="text-green-500 mb-2" />
            <h3 className="font-bold text-gray-800 text-lg">Relatório Enviado!</h3>
            <p className="text-sm text-gray-500">Você já garantiu seus golds de hoje. Volte amanhã!</p>
          </div>
        )}

        <span className="text-xs font-extrabold text-gray-400 block mb-2">RELATÓRIO DIÁRIO</span>
        
        <div className="text-center my-6">
          <h1 className="text-7xl font-light text-gray-800 tracking-tighter">{dailyCount}<span className="text-2xl text-gray-300">/{maxPosts}</span></h1>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Postagens</p>
        </div>

        {/* Dynamic Gradient Progress Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full mb-8 overflow-hidden shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r ${progressGradient} transition-all duration-500 ease-out shadow-lg`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button 
            onClick={() => changeCount(-1)}
            disabled={hasSubmittedToday || dailyCount === 0}
            className="w-14 h-14 rounded-2xl border border-gray-200 text-gray-400 text-2xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            -
          </button>
          <button 
            onClick={() => changeCount(1)}
            disabled={hasSubmittedToday || dailyCount >= maxPosts}
            className={`w-14 h-14 rounded-2xl text-white text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50
              ${dailyCount >= maxPosts ? 'bg-gray-300' : `bg-gradient-to-br ${progressGradient}`}
            `}
          >
            +
          </button>
        </div>

        <button 
          onClick={handleInitialSubmit}
          disabled={hasSubmittedToday || dailyCount === 0}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide shadow-md active:opacity-90 transition-all text-white
             ${hasSubmittedToday ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#C06014]'}
          `}
        >
          {hasSubmittedToday ? 'Enviado Hoje' : 'Confirmar Posts'}
        </button>
      </div>

      {/* --- GIFT BOX MODAL --- */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[30px] p-6 text-center shadow-2xl relative overflow-hidden">
            
            {!rewardResult ? (
              <>
                <h2 className="font-montserrat font-bold text-2xl text-[#C06014] mb-2">Escolha seu Bônus!</h2>
                <p className="text-sm text-gray-500 mb-8">Selecione uma caixa para revelar seu presente extra.</p>
                
                <div className="flex justify-center gap-4 mb-4">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => openGift(idx)}
                      disabled={selectedGiftIndex !== null}
                      className={`
                        w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300
                        ${selectedGiftIndex === idx ? 'scale-110 bg-orange-100 ring-4 ring-[#C06014]' : 'bg-gray-50 hover:bg-orange-50 scale-100'}
                        ${selectedGiftIndex !== null && selectedGiftIndex !== idx ? 'opacity-30 scale-90' : ''}
                      `}
                    >
                      <Gift 
                        size={32} 
                        className={`transition-transform duration-500 ${selectedGiftIndex === idx ? 'animate-bounce text-[#C06014]' : 'text-gray-400'}`} 
                      />
                      <span className="text-xs font-bold text-gray-400 uppercase">Box {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-[spin_3s_linear_infinite]">
                  <span className="text-4xl">🎁</span>
                </div>
                <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-1">
                  +{rewardResult.base + rewardResult.bonus} <span className="text-[#C06014]">Gold</span>
                </h2>
                <div className="flex justify-center gap-2 text-xs font-semibold text-gray-400 mb-8 uppercase tracking-wide">
                  <span>Base: {rewardResult.base}</span>
                  <span>•</span>
                  <span className="text-green-600">Bônus: {rewardResult.bonus}</span>
                </div>
                
                <button 
                  onClick={closeGiftModal}
                  className="w-full py-4 rounded-xl bg-[#C06014] text-white font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Receber
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </>
  );
};