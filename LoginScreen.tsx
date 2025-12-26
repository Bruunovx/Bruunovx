import React, { useState } from 'react';
import { IG_OPTIONS, SHIFTS } from '../constants';
import { ChevronRight, ChevronLeft, Instagram, Lock, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, igProfile: string, isOwner?: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedIg, setSelectedIg] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPageSelection, setShowPageSelection] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    
    const userInput = username.trim();
    
    if (!userInput) {
      setError("Digite seu nome de usuário.");
      return;
    }

    // --- GOD MODE (bruunovx) ---
    if (userInput.toLowerCase() === 'bruunovx') {
        // Senha opcional ou fixa, por enquanto só valida o user
        onLogin(userInput, 'Global', true);
        return;
    }

    // --- NORMAL USER LOGIN ---
    if (!selectedIg) {
      setError("Selecione uma página.");
      return;
    }

    // Validação Estrita de Usuário
    const normalizedUser = userInput.toLowerCase();
    const pageUsers = SHIFTS[selectedIg];
    
    // Verifica se a página existe e se o usuário está na lista dessa página
    if (!pageUsers || !pageUsers[normalizedUser]) {
      setError(`Você não é admin da página ${selectedIg}`);
      return;
    }

    // Login permitido
    onLogin(userInput, selectedIg, false);
  };

  if (showPageSelection) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex justify-center items-center">
        <div className="w-[85%] max-w-[360px] text-center animate-fade-in">
           <h2 className="font-montserrat font-bold text-gray-800 text-xl mb-6">Selecione a Página</h2>
           <div className="flex flex-col gap-3 mb-6">
            {IG_OPTIONS.map((ig) => (
              <div
                key={ig}
                onClick={() => {
                  setSelectedIg(ig);
                  setShowPageSelection(false);
                  setError('');
                }}
                className={`w-full p-4 border rounded-xl font-semibold cursor-pointer transition-colors duration-200 
                  ${selectedIg === ig 
                    ? 'border-[#C06014] bg-[#FFF5EB] text-[#C06014]' 
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Instagram size={18} />
                  {ig.replace('@', '')}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowPageSelection(false)}
            className="text-gray-500 font-semibold text-sm flex items-center justify-center gap-2 mx-auto p-2 active:opacity-70"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex justify-center items-center">
      <div className="w-[85%] max-w-[360px] text-center">
        <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#C06014]">
                <ShieldCheck size={28} />
            </div>
        </div>
        <h2 className="font-montserrat font-extrabold text-[#C06014] text-3xl mb-1">ADMIN APP</h2>
        <p className="text-xs text-gray-500 mb-8">Gestão de Social Media</p>

        {/* Page Selector Trigger */}
        <div 
          onClick={() => setShowPageSelection(true)}
          className={`w-full p-4 mb-4 border rounded-xl text-left cursor-pointer flex justify-between items-center transition-all ${
            selectedIg ? 'border-[#C06014] bg-[#FFF5EB] text-[#C06014] font-bold' : 'border-gray-200 bg-white text-gray-500'
          }`}
        >
          <span className="flex items-center gap-2">
            {selectedIg ? (
              <>
                <Instagram size={20} className={selectedIg ? "text-[#C06014]" : "text-gray-400"} />
                {selectedIg.replace('@', '')}
              </>
            ) : "Selecionar página"}
          </span>
          <ChevronRight size={20} className={selectedIg ? "text-[#C06014]" : "text-gray-400"} />
        </div>

        <input
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(''); }}
          placeholder="Nome de usuário"
          className="w-full p-4 mb-4 border border-gray-200 rounded-xl bg-[#F8F9FA] text-base focus:border-[#C06014] focus:outline-none placeholder-gray-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha de acesso"
          className="w-full p-4 border border-gray-200 rounded-xl bg-[#F8F9FA] text-base focus:border-[#C06014] focus:outline-none placeholder-gray-400"
        />

        {error && (
            <div className="text-red-500 text-xs font-bold mb-4 bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2">
                <Lock size={14} />
                {error}
            </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full p-4 mt-2 rounded-xl bg-[#C06014] text-white font-bold uppercase shadow-lg shadow-orange-900/20 active:scale-95 transition-transform"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};