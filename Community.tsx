import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { getDatabase, addMessage, getUserProfile, getAvatarById, getItemById } from '../services/storageService';
import { Send } from 'lucide-react';

interface CommunityProps {
  username: string;
}

export const Community: React.FC<CommunityProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    const db = getDatabase();
    setMessages(db.messages.slice(-50)); // Keep last 50 for performance
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000); // Poll for new messages
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addMessage(username, inputValue.trim());
    setInputValue('');
    loadMessages();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <h2 className="font-montserrat text-xl font-bold mb-4 text-gray-800">Comunidade</h2>
      <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col h-[500px]">
        
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto mb-4 pr-1 flex flex-col gap-4 no-scrollbar"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">Nenhuma mensagem ainda.</div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.user === username;
            
            // Resolve profile just-in-time
            const profile = getUserProfile(msg.user);
            const avatar = getAvatarById(profile.avatarId);
            const customImg = profile.customAvatarUrl;

            // Styles
            const equippedBorder = profile.equipped?.border ? getItemById(profile.equipped.border)?.cssClass : '';

            return (
              <div 
                key={idx} 
                className={`flex gap-2 max-w-[90%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar Bubble */}
                <div className={`relative w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm overflow-visible ${!customImg ? avatar.bg : 'bg-gray-50'} ${equippedBorder || 'border border-gray-100'}`}>
                  {customImg ? (
                      <img src={customImg} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                      avatar.icon
                  )}
                </div>

                <div 
                  className={`p-3 rounded-2xl text-sm relative shadow-sm ${
                    isMe 
                      ? 'bg-[#FFF5EB] border border-[#FFE0C2] text-orange-900 rounded-tr-none' 
                      : 'bg-[#F8F9FA] text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className={`text-[10px] font-extrabold mb-0.5 flex items-center gap-1 ${isMe ? 'text-[#C06014] justify-end' : 'text-gray-500'}`}>
                    {profile.nickname} <span className="font-normal opacity-50">• {msg.time}</span>
                  </div>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-3 border border-gray-200 rounded-xl bg-[#F8F9FA] text-sm focus:border-[#C06014] focus:outline-none"
            placeholder="Aviso ou mensagem..."
          />
          <button 
            onClick={handleSend}
            className="bg-[#C06014] text-white px-4 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </>
  );
};