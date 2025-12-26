import React, { useEffect, useState } from 'react';
import { getDatabase, getUserProfile, getAvatarById, getPageTotalScore, getRankInfo, getItemById } from '../services/storageService';
import { UserProfile, RankTier } from '../types';
import { IG_OPTIONS } from '../constants';
import { Trophy, ChevronLeft, Medal, Users } from 'lucide-react';

interface RankingEntry {
  profile: UserProfile;
  score: number;
}

interface PageRankingEntry {
  pageName: string;
  totalScore: number;
}

interface RankingProps {
  username: string; // Current user ID
}

export const Ranking: React.FC<RankingProps> = ({ username }) => {
  const [view, setView] = useState<'pages' | 'adms'>('pages');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  
  const [pageRanking, setPageRanking] = useState<PageRankingEntry[]>([]);
  const [admRanking, setAdmRanking] = useState<RankingEntry[]>([]);

  // Carrega Ranking das Páginas
  useEffect(() => {
    if (view === 'pages') {
      const data = IG_OPTIONS.map(page => ({
        pageName: page,
        totalScore: getPageTotalScore(page)
      }));
      // Sort desc
      data.sort((a, b) => b.totalScore - a.totalScore);
      setPageRanking(data);
    }
  }, [view, username]);

  // Carrega Ranking de ADMs quando uma página é selecionada
  useEffect(() => {
    if (view === 'adms' && selectedPage) {
      const db = getDatabase();
      const data: RankingEntry[] = Object.entries(db.scores)
        .filter(([key]) => key.startsWith(selectedPage))
        .map(([user, score]) => ({
            profile: getUserProfile(user),
            score: score
        }));
      
      data.sort((a, b) => b.score - a.score);
      setAdmRanking(data);
    }
  }, [view, selectedPage]);

  const handlePageClick = (page: string) => {
    setSelectedPage(page);
    setView('adms');
  };

  const handleBack = () => {
    setView('pages');
    setSelectedPage(null);
  };

  const formatScore = (val: number) => val % 1 !== 0 ? val.toFixed(1) : val.toString();

  // --- RENDER VIEW: PAGES ---
  if (view === 'pages') {
    return (
      <>
        <h2 className="font-montserrat text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Trophy className="text-[#C06014]" size={24} />
          Ranking Global
        </h2>

        <div className="flex flex-col gap-4">
          {pageRanking.map((entry, index) => {
            let rankColor = 'bg-white border-gray-100 text-gray-600';
            
            if (index === 0) rankColor = 'bg-yellow-50 border-yellow-200 text-yellow-800';
            if (index === 1) rankColor = 'bg-gray-50 border-gray-200 text-gray-700';
            if (index === 2) rankColor = 'bg-orange-50 border-orange-200 text-orange-800';

            return (
              <div 
                key={entry.pageName}
                onClick={() => handlePageClick(entry.pageName)}
                className={`relative p-5 rounded-[20px] border shadow-sm cursor-pointer transition-transform active:scale-95 flex items-center justify-between ${rankColor}`}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-lg shadow-sm border border-gray-100`}>
                      {index + 1}
                   </div>
                   <div>
                      <h3 className="font-bold text-sm">{entry.pageName}</h3>
                      <p className="text-[10px] uppercase font-bold opacity-60">Ver Membros</p>
                   </div>
                </div>
                
                <div className="text-right">
                   <span className="block text-2xl font-black">{formatScore(entry.totalScore)}</span>
                   <span className="text-[10px] uppercase font-bold opacity-60">Gold Total</span>
                </div>
                
                {index === 0 && (
                    <div className="absolute -top-3 -right-2">
                        <Medal size={32} className="text-yellow-400 drop-shadow-sm" />
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // --- RENDER VIEW: ADMS ---
  return (
    <>
      <button 
        onClick={handleBack}
        className="mb-4 text-gray-500 font-bold text-xs flex items-center gap-1 hover:text-[#C06014] transition-colors"
      >
        <ChevronLeft size={16} /> Voltar
      </button>

      <h2 className="font-montserrat text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Users className="text-[#C06014]" size={24} />
        Ranking: {selectedPage?.replace('@', '')}
      </h2>

      <div className="flex flex-col gap-3 pb-20">
        {admRanking.length === 0 && <p className="text-center text-gray-400">Nenhum dado ainda.</p>}
        
        {admRanking.map((entry, index) => {
          const avatar = getAvatarById(entry.profile.avatarId);
          const customImg = entry.profile.customAvatarUrl;
          const isMe = entry.profile.username === username;
          
          // Rank Info
          const rankInfo = getRankInfo(entry.score);

          // Items Styling
          const equippedBorder = entry.profile.equipped?.border ? getItemById(entry.profile.equipped.border)?.cssClass : '';

          return (
            <div 
              key={entry.profile.username} 
              className={`rounded-[20px] p-4 flex justify-between items-center transition-all ${
                isMe 
                  ? 'bg-orange-50 border-2 border-orange-200 shadow-md transform scale-[1.02]' 
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-500`}>
                      {index + 1}
                  </div>

                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${!customImg ? avatar.bg : 'bg-gray-50'} ${equippedBorder || 'border border-gray-100'}`}>
                    {customImg ? (
                        <img src={customImg} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <span className="text-2xl">{avatar.icon}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${isMe ? 'text-[#C06014]' : 'text-gray-800'}`}>
                        {entry.profile.nickname} {isMe && '(Você)'}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px]">{rankInfo.icon}</span>
                        <span className={`text-[10px] uppercase font-bold ${rankInfo.color}`}>
                            {rankInfo.tier}
                        </span>
                    </div>
                  </div>
              </div>
              <b className={`${isMe ? 'text-[#C06014]' : 'text-gray-600'} text-lg`}>{formatScore(entry.score)}</b>
            </div>
          );
        })}
      </div>
    </>
  );
};