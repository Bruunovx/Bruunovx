import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { Community } from './components/Community';
import { Ranking } from './components/Ranking';
import { Wallet } from './components/Wallet';
import { Profile } from './components/Profile';
import { OwnerDashboard } from './components/OwnerDashboard';
import { Notification } from './components/Notification';
import { UserSession, Tab, UserProfile } from './types';
import { SHIFTS } from './constants';
import { getUserScore, getUserProfile, getAvatarById, updateUserProfile, checkAndApplyPenalty, getItemById, consumeUserNotifications, subscribeToDatabase, isDatabaseReady } from './services/storageService';
import { BarChart3, MessageCircle, Crown, ShoppingBag, Instagram, Wallet as WalletIcon, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.DASHBOARD);
  const [userScore, setUserScore] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState({ visible: false, message: '' });

  // Init Firebase Sync
  useEffect(() => {
    subscribeToDatabase(() => {
        // This callback runs whenever Firebase data changes
        // If we have a session, refresh the user data in UI
        if (session) {
             refreshUserData(session.username);
        }
        setLoading(false);
    });
  }, [session?.username]);

  const handleLogin = (username: string, igProfile: string, isOwner: boolean = false) => {
    if (isOwner) {
        setSession({
            username: 'bruunovx',
            igProfile: 'Global',
            realName: 'Bruno',
            isOwner: true
        });
        return;
    }

    const uniqueId = `${igProfile}::${username.toLowerCase()}`;
    
    // Ensure profile exists in DB (creates it if not)
    const existing = getUserProfile(uniqueId);
    if (existing.nickname === uniqueId) {
        updateUserProfile(uniqueId, { nickname: username });
    }

    setSession({ 
        username: uniqueId, 
        igProfile, 
        realName: username,
        isOwner: false
    });

    const punished = checkAndApplyPenalty(uniqueId);
    if (punished) {
       setTimeout(() => {
         setNotification({
             visible: true,
             message: "🚫 PUNIÇÃO: Você perdeu 50 Gold por não bater a meta ontem!"
         });
       }, 500);
    }

    refreshUserData(uniqueId);
  };

  const refreshUserData = (username: string = session?.username || '') => {
    if (!username) return;
    // These functions now pull from the synced GLOBAL_DB
    setUserScore(getUserScore(username));
    setUserProfile(getUserProfile(username));
  };

  useEffect(() => {
    if (!session || session.isOwner) return;

    // Shift Check Logic
    const checkTime = () => {
      const pageShifts = SHIFTS[session.igProfile];
      if (!pageShifts) return;

      const userShift = pageShifts[session.realName.toLowerCase()];
      if (!userShift) return;

      const now = new Date();
      const [h, m] = userShift.split(':').map(Number);
      const shiftTime = new Date();
      shiftTime.setHours(h, m, 0);

      const diffMinutes = (shiftTime.getTime() - now.getTime()) / 1000 / 60;

      if (diffMinutes > 0 && diffMinutes <= 10) {
        setNotification({
          visible: true,
          message: `⚠️ Faltam ${Math.ceil(diffMinutes)} min para sua postagem!`
        });
      }
    };

    // Inbox Check Logic
    const checkInbox = () => {
        const msgs = consumeUserNotifications(session.username);
        if (msgs.length > 0) {
            setNotification({
                visible: true,
                message: msgs[0] 
            });
            refreshUserData();
        }
    };

    const interval = setInterval(() => {
        checkTime();
        checkInbox();
    }, 10000); 
    
    checkTime(); 
    checkInbox();

    return () => clearInterval(interval);
  }, [session]);

  if (loading) {
      return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
              <Loader2 size={48} className="text-[#C06014] animate-spin mb-4" />
              <p className="text-gray-500 font-bold animate-pulse">Conectando ao Servidor...</p>
          </div>
      );
  }

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // --- OWNER VIEW ---
  if (session.isOwner) {
      return (
          <div className="flex flex-col h-screen bg-[#F8F9FA] overflow-hidden">
             <div className="max-w-md mx-auto w-full h-full p-5">
                <OwnerDashboard onLogout={() => window.location.reload()} />
             </div>
          </div>
      );
  }

  // --- STANDARD USER VIEW ---
  const renderContent = () => {
    switch (currentTab) {
      case Tab.DASHBOARD:
        return <Dashboard username={session.username} onUpdateScore={() => refreshUserData()} />;
      case Tab.COMMUNITY:
        return <Community username={session.username} />;
      case Tab.WALLET:
        return <Wallet username={session.username} />;
      case Tab.RANKING:
        return <Ranking username={session.username} />;
      case Tab.STORE:
        return <Profile session={session} onProfileUpdate={() => refreshUserData()} />;
      default:
        return null;
    }
  };

  const avatar = userProfile ? getAvatarById(userProfile.avatarId) : null;
  const customAvatar = userProfile?.customAvatarUrl;
  
  const equippedBorder = userProfile?.equipped?.border ? getItemById(userProfile.equipped.border)?.cssClass : '';

  const formattedScore = userScore % 1 !== 0 
    ? userScore.toFixed(1) 
    : userScore.toString();

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] overflow-hidden">
      
      <Notification 
        message={notification.message} 
        isVisible={notification.visible} 
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))} 
      />

      {/* Header */}
      <header className="h-[76px] bg-white flex justify-between items-center px-5 border-b border-gray-200 shrink-0 z-10">
        
        {/* Left: IG Page */}
        <div className="flex flex-col">
          <div className="font-montserrat font-extrabold text-gray-800 text-sm flex items-center gap-1.5">
            <Instagram size={16} className="text-[#C06014]" />
            {session.igProfile.replace('@', '')}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">ADMIN PANEL</span>
        </div>

        {/* Right: User Profile & Coins */}
        <div className="flex items-center gap-3">
          {/* Coins Pill */}
          <div 
             onClick={() => setCurrentTab(Tab.WALLET)}
             className="bg-orange-50 border border-orange-100 px-3 py-1 rounded-full font-bold text-orange-800 text-xs flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 transition-transform"
          >
            {formattedScore} <span className="text-yellow-500">🟡</span>
          </div>

          {/* User Avatar */}
          {userProfile && avatar && (
            <div 
              onClick={() => setCurrentTab(Tab.STORE)} 
              className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm cursor-pointer active:scale-95 transition-transform ${!customAvatar ? avatar.bg : 'bg-gray-50'} ${equippedBorder || 'border border-gray-100'}`}
            >
              {customAvatar ? (
                  <img src={customAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                  avatar.icon
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-grow overflow-y-auto p-5 pb-24">
        <div className="max-w-md mx-auto h-full">
           {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-[70px] bg-white fixed bottom-0 left-0 w-full flex justify-around items-center border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-20 safe-area-bottom px-2">
        <NavItem 
          icon={<BarChart3 />} 
          isActive={currentTab === Tab.DASHBOARD} 
          onClick={() => setCurrentTab(Tab.DASHBOARD)} 
        />
        <NavItem 
          icon={<MessageCircle />} 
          isActive={currentTab === Tab.COMMUNITY} 
          onClick={() => setCurrentTab(Tab.COMMUNITY)} 
        />
         <NavItem 
          icon={<WalletIcon />} 
          isActive={currentTab === Tab.WALLET} 
          onClick={() => setCurrentTab(Tab.WALLET)} 
        />
        <NavItem 
          icon={<Crown />} 
          isActive={currentTab === Tab.RANKING} 
          onClick={() => setCurrentTab(Tab.RANKING)} 
        />
        <NavItem 
          icon={<ShoppingBag />} 
          isActive={currentTab === Tab.STORE} 
          onClick={() => setCurrentTab(Tab.STORE)} 
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; isActive: boolean; onClick: () => void }> = ({ icon, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full transition-all duration-300 ${
      isActive 
        ? 'text-[#C06014] -translate-y-1 bg-orange-50' 
        : 'text-gray-400 opacity-70 hover:opacity-100'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: isActive ? 3 : 2 })}
  </button>
);

export default App;