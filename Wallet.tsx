import React, { useEffect, useState } from 'react';
import { getUserProfile, getUserScore } from '../services/storageService';
import { UserProfile } from '../types';
import { Wallet as WalletIcon, TrendingUp, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

interface WalletProps {
  username: string;
}

export const Wallet: React.FC<WalletProps> = ({ username }) => {
  const [userScore, setUserScore] = useState<number>(0);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [selectedDateDetails, setSelectedDateDetails] = useState<{date: string, count: number, bonus: number} | null>(null);

  useEffect(() => {
    setUserScore(getUserScore(username));
    setCurrentUserProfile(getUserProfile(username));
  }, [username]);

  const formatScore = (val: number) => {
    return val % 1 !== 0 ? val.toFixed(1) : val.toString();
  };

  // --- CALENDAR LOGIC ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayData = (day: number) => {
    if (!currentUserProfile?.history) return null;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return {
        data: currentUserProfile.history[dateStr],
        dateStr
    };
  };

  return (
    <>
      <h2 className="font-montserrat text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <WalletIcon className="text-[#C06014]" size={24} />
        Minha Carteira
      </h2>
      
      {/* CARD DE SALDO */}
      <div className="bg-gradient-to-br from-[#C06014] to-[#E67E22] rounded-[20px] p-6 text-white shadow-lg shadow-orange-500/20 mb-8 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-black opacity-5 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-orange-100 text-xs font-bold uppercase tracking-wider block mb-1">Seu Saldo Total</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{formatScore(userScore)}</span>
              <span className="text-lg font-medium opacity-80">Gold</span>
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <TrendingUp size={24} className="text-white" />
          </div>
        </div>
        
        <div className="mt-4 text-xs text-orange-100/80 font-medium">
            * Cumpra a meta diária (5 posts) para evitar multas.
        </div>
      </div>

       {/* CALENDÁRIO */}
       <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600 font-bold text-sm uppercase tracking-wide">
                <CalendarIcon size={16} className="text-[#C06014]" />
                Histórico ({new Date().toLocaleString('pt-BR', { month: 'long' })})
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
                const info = getDayData(day);
                const report = info?.data;
                const hasReport = !!report;
                
                // Lógica de cor baseada na meta
                // Verde: 5 posts. Amarelo: <5 posts. Cinza: Sem post.
                let bgClass = 'bg-gray-50 text-gray-300';
                if (hasReport) {
                    if (report.count >= 5) bgClass = 'bg-green-100 text-green-700 border border-green-200';
                    else bgClass = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
                }

                const isSelected = selectedDateDetails?.date === info?.dateStr;

                return (
                    <div 
                        key={day}
                        onClick={() => hasReport && setSelectedDateDetails({
                            date: info!.dateStr,
                            count: info!.data!.count,
                            bonus: info!.data!.bonus
                        })}
                        className={`
                            aspect-square rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all
                            ${bgClass}
                            ${isSelected ? 'ring-2 ring-[#C06014] scale-110 z-10' : ''}
                        `}
                    >
                        {day}
                    </div>
                );
            })}
          </div>

          {/* LEGENDA RÁPIDA */}
          <div className="flex justify-center gap-4 mt-4 text-[10px] text-gray-400 font-bold uppercase">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div> Meta OK</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Incompleto</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200"></div> Vazio</div>
          </div>

          {/* DETALHES DO DIA SELECIONADO */}
          {selectedDateDetails && (
              <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 flex justify-between items-center animate-fade-in">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-400 block">
                        {new Date(selectedDateDetails.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </span>
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-1">
                        {selectedDateDetails.count} Posts
                        {selectedDateDetails.count < 5 && <AlertCircle size={12} className="text-red-500" />}
                    </div>
                  </div>
                  <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-orange-400 block">Bônus</span>
                      <span className="font-bold text-[#C06014]">+{selectedDateDetails.bonus} Gold</span>
                  </div>
              </div>
          )}
      </div>
    </>
  );
};