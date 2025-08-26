"use client";

import { useState, useEffect, useRef } from 'react';

interface Tab {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  createdAt: Date;
  suspendedAt?: Date;
}

export default function OperaBrowser() {
  const [activeNav, setActiveNav] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPage, setMenuPage] = useState(1);
  const [tabsOpen, setTabsOpen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [suspendedTabs, setSuspendedTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [tabIdCounter, setTabIdCounter] = useState(1);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const tabIcons = ['fas fa-globe', 'fas fa-home', 'fas fa-star', 'fas fa-heart', 'fas fa-bolt', 'fas fa-fire'];
  const tabColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ];

  const menuPages = [
    {
      items: [
        { icon: 'fas fa-moon', text: 'Night mode', disabled: false },
        { icon: 'fas fa-shield-alt', text: 'Ad blocking', disabled: false },
        { icon: 'fas fa-history', text: 'History', disabled: false },
        { icon: 'fas fa-search', text: 'Find in page', disabled: false },
        { icon: 'fas fa-save', text: 'Save', disabled: true },
        { icon: 'fas fa-bookmark', text: 'Saved pages', disabled: false },
        { icon: 'fas fa-user-secret', text: 'Incognito mode', disabled: false },
        { icon: 'fas fa-sync-alt', text: 'Refresh', disabled: false },
        { icon: 'fas fa-redo', text: 'Reload', disabled: false }
      ]
    },
    {
      items: [
        { icon: 'fas fa-bookmark', text: 'Bookmarks', disabled: false },
        { icon: 'fas fa-download', text: 'Downloads', disabled: false },
        { icon: 'fas fa-share', text: 'Share', disabled: false },
        { icon: 'fas fa-plus-square', text: 'Add bookmark', disabled: false },
        { icon: 'fas fa-desktop', text: 'Desktop site', disabled: false },
        { icon: 'fas fa-language', text: 'Translate', disabled: true }
      ]
    },
    {
      items: [
        { icon: 'fas fa-home', text: 'Add to home screen', disabled: false },
        { icon: 'fas fa-volume-up', text: 'Read aloud', disabled: false },
        { icon: 'fas fa-text-height', text: 'Text size', disabled: false },
        { icon: 'fas fa-palette', text: 'Theme', disabled: false },
        { icon: 'fas fa-font', text: 'Font', disabled: false },
        { icon: 'fas fa-cog', text: 'Settings', disabled: false }
      ]
    }
  ];

  const apps = [
    { name: 'GitHub', icon: 'fab fa-github' },
    { name: 'Telegram', icon: 'fab fa-telegram' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp' },
    { name: 'Instagram', icon: 'fab fa-instagram' },
    { name: 'X', icon: 'X', custom: true },
    { name: 'Facebook', icon: 'fab fa-facebook' },
    { name: 'YouTube', icon: 'fab fa-youtube' },
    { name: 'Google', icon: 'fab fa-google' }
  ];

  const createNewTab = () => {
    const tabId = `tab-${tabIdCounter}`;
    const iconIndex = Math.floor(Math.random() * tabIcons.length);
    const colorIndex = Math.floor(Math.random() * tabColors.length);
    
    const newTab: Tab = {
      id: tabId,
      title: `New Tab ${tabs.length + 1}`,
      url: 'https://www.google.com',
      icon: tabIcons[iconIndex],
      color: tabColors[colorIndex],
      createdAt: new Date()
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(tabId);
    setTabIdCounter(prev => prev + 1);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
      const tab = tabs[tabIndex];
      
      // Move to suspended tabs
      const suspendedTab = { ...tab, suspendedAt: new Date() };
      setSuspendedTabs(prev => [suspendedTab, ...prev]);
      
      // Remove from active tabs
      const newTabs = tabs.filter(t => t.id !== tabId);
      setTabs(newTabs);
      
      // If closing active tab, set new active tab
      if (activeTabId === tabId) {
        setActiveTabId(newTabs.length > 0 ? newTabs[0].id : null);
      }
    }
  };

  const switchToTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const restoreSuspendedTab = (tabId: string) => {
    const tabIndex = suspendedTabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
      const tab = suspendedTabs[tabIndex];
      const { suspendedAt, ...restoredTab } = tab;
      
      setTabs(prev => [restoredTab, ...prev]);
      setSuspendedTabs(prev => prev.filter(t => t.id !== tabId));
      setActiveTabId(tabId);
    }
  };

  const deleteSuspendedTab = (tabId: string) => {
    setSuspendedTabs(prev => prev.filter(tab => tab.id !== tabId));
  };

  const formatTimeDifference = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && menuPage < 3) {
        setMenuPage(prev => prev + 1);
      } else if (diff < 0 && menuPage > 1) {
        setMenuPage(prev => prev - 1);
      }
    }
  };

  // Initialize with one tab
  useEffect(() => {
    createNewTab();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menuPopup = document.getElementById('menuPopup');
      const menuToggle = document.getElementById('menuToggle');
      const tabsInterface = document.getElementById('tabsInterface');
      const tabsNav = document.getElementById('tabsNav');
      
      if (menuPopup && !menuPopup.contains(e.target as Node) && 
          menuToggle && !menuToggle.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      
      if (tabsInterface && !tabsInterface.contains(e.target as Node) && 
          tabsNav && !tabsNav.contains(e.target as Node)) {
        setTabsOpen(false);
        if (activeNav === 'tabs') {
          setActiveNav('home');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeNav]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="w-full max-w-md h-[100vh] max-h-[896px] bg-gray-900 rounded-3xl overflow-hidden relative flex flex-col shadow-2xl border border-gray-800">
        
        {/* Header Bar */}
        <div className="h-14 bg-black/20 backdrop-blur-lg flex justify-between items-center px-4 relative z-100 border-b border-gray-800">
          <div className="flex items-center gap-4">
            {/* Empty space where arrows were */}
          </div>
          <div className="flex items-center gap-2 text-red-500 font-bold">
            <i className="fas fa-compass text-xl animate-pulse"></i>
            <span className="text-lg">Opera</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden bg-black/20">
          
          {/* Google Search Bar */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-3.5 px-5 flex items-center mb-5 border border-gray-800 hover:border-blue-500/30 transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-lg focus-within:shadow-blue-500/10">
            <i className="fab fa-google text-blue-500 text-xl mr-3 opacity-80"></i>
            <input 
              type="text" 
              placeholder="Search Google or type a URL" 
              className="flex-1 bg-transparent border-none text-white placeholder-gray-500 outline-none font-medium"
            />
          </div>
          
          {/* Currency & Crypto Cards */}
          <div className="flex flex-col gap-2 mb-5 pb-2">
            {/* First Row: Traditional Currencies */}
            <div className="flex gap-2 justify-between">
              <div className="flex-1 min-w-[70px] h-[90px] bg-white/8 backdrop-blur-lg rounded-xl border border-gray-800 flex flex-col justify-center items-center p-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 relative overflow-hidden group animate-fadeInUp animate-delay-100">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">$</div>
                <div className="font-semibold text-sm text-white">USD</div>
                <div className="text-xs text-gray-400 font-medium">1.00</div>
              </div>
              
              <div className="flex-1 min-w-[70px] h-[90px] bg-white/8 backdrop-blur-lg rounded-xl border border-gray-800 flex flex-col justify-center items-center p-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 relative overflow-hidden group animate-fadeInUp animate-delay-200">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">€</div>
                <div className="font-semibold text-sm text-white">EUR</div>
                <div className="text-xs text-gray-400 font-medium">0.92</div>
              </div>
              
              <div className="flex-1 min-w-[70px] h-[90px] bg-white/8 backdrop-blur-lg rounded-xl border border-gray-800 flex flex-col justify-center items-center p-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 relative overflow-hidden group animate-fadeInUp animate-delay-300">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">£</div>
                <div className="font-semibold text-sm text-white">GBP</div>
                <div className="text-xs text-gray-400 font-medium">0.79</div>
              </div>
            </div>
            
            {/* Second Row: Cryptocurrencies */}
            <div className="flex gap-2 justify-between">
              <div className="flex-1 min-w-[70px] h-[90px] bg-white/8 backdrop-blur-lg rounded-xl border border-gray-800 flex flex-col justify-center items-center p-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 relative overflow-hidden group animate-fadeInUp animate-delay-400">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">₿</div>
                <div className="font-semibold text-sm text-white">Bitcoin</div>
                <div className="text-xs text-gray-400 font-medium">$43,250</div>
              </div>
              
              <div className="flex-1 min-w-[70px] h-[90px] bg-white/8 backdrop-blur-lg rounded-xl border border-gray-800 flex flex-col justify-center items-center p-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 relative overflow-hidden group animate-fadeInUp animate-delay-500">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  <i className="fab fa-ethereum"></i>
                </div>
                <div className="font-semibold text-sm text-white">Ethereum</div>
                <div className="text-xs text-gray-400 font-medium">$2,280</div>
              </div>
            </div>
          </div>
          
          {/* Add Site Section */}
          <div className="flex items-center mb-5 p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-gray-800 cursor-pointer transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 animate-fadeInUp animate-delay-600">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 text-white transition-all duration-300">
              <i className="fas fa-plus"></i>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">Add site</div>
              <div className="text-xs text-gray-400">Add your favorite websites to quick access</div>
            </div>
          </div>
          
          {/* Quick Apps Grid */}
          <div className="mb-7">
            <div className="grid grid-cols-4 gap-4">
              {apps.map((app, index) => {
                const delayClass = `animate-delay-${700 + index * 100}`;
                return (
                  <div 
                    key={app.name}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-xl hover:bg-white/5 hover:scale-105 animate-fadeInUp ${delayClass}`}
                  >
                  <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-lg border border-gray-800 flex items-center justify-center mb-2.5 text-white text-xl transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-300 hover:opacity-10"></div>
                    {app.custom ? (
                      <span className="font-bold text-2xl" style={{ fontFamily: 'Arial, sans-serif' }}>{app.icon}</span>
                    ) : (
                      <i className={app.icon}></i>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-medium text-center w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {app.name}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Tabs Management Interface */}
        {tabsOpen && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900/90 to-gray-950 z-150 flex flex-col overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="h-16 bg-gradient-to-r from-gray-900/30 to-slate-900/30 backdrop-blur-lg flex justify-between items-center px-6 border-b border-gray-800/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                  <i className="fas fa-layer-group text-gray-300 text-sm"></i>
                </div>
                <div className="text-lg font-semibold text-gray-300">My Tabs</div>
              </div>
              <button 
                className="w-8 h-8 bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 transition-all duration-300 hover:scale-110"
                onClick={() => {
                  setTabsOpen(false);
                  setActiveNav('home');
                }}
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900/30 to-gray-950/50">
              {/* New Tab Button */}
              <button 
                className="w-full bg-gradient-to-r from-gray-700 via-slate-700 to-gray-700 text-gray-200 border-none py-4 rounded-2xl font-semibold text-base cursor-pointer mb-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-700/30 flex items-center justify-center gap-3 relative overflow-hidden group"
                onClick={createNewTab}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm relative z-10">
                  <i className="fas fa-plus text-gray-300 text-sm"></i>
                </div>
                <span className="relative z-10 text-gray-200">Create New Tab</span>
              </button>
              
              {/* Active Tabs Section */}
              {tabs.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-600/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-circle text-gray-500 text-xs"></i>
                      </div>
                      <h3 className="text-gray-300 font-medium">Active Tabs</h3>
                      <span className="text-gray-500 text-sm">({tabs.length})</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {tabs.map(tab => (
                      <div 
                        key={tab.id}
                        className={`bg-gray-800/30 backdrop-blur-lg border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden hover:scale-105 hover:shadow-xl group ${tab.id === activeTabId ? 'border-gray-600/50 shadow-lg shadow-gray-700/20 bg-gray-800/50' : 'border-gray-800/30 hover:border-gray-600/40'}`}
                        onClick={() => switchToTab(tab.id)}
                      >
                        {/* Tab Preview */}
                        <div className="w-full h-20 rounded-xl mb-3 flex flex-col items-center justify-center relative overflow-hidden shadow-lg bg-gray-900 border border-gray-800">
                          {/* Website Logo - using Google's favicon service */}
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-1 overflow-hidden">
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${tab.url.replace('https://www.', '').replace('https://', '').split('/')[0]}&sz=32`}
                              alt="Website logo"
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                // Fallback to letter if logo fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.fallback-letter');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'block';
                                }
                              }}
                            />
                            <div className="fallback-letter text-blue-500 text-lg font-bold" style={{display: 'none'}}>
                              {tab.icon.includes('globe') ? 'G' : 
                               tab.icon.includes('home') ? 'H' : 
                               tab.icon.includes('star') ? 'S' : 
                               tab.icon.includes('heart') ? '♥' : 
                               tab.icon.includes('bolt') ? '⚡' : 
                               tab.icon.includes('fire') ? '🔥' : 'T'}
                            </div>
                          </div>
                          {/* Site name below icon */}
                          <div className="text-xs text-gray-400 font-medium truncate px-2">
                            {tab.url.replace('https://www.', '').replace('https://', '').split('/')[0]}
                          </div>
                        </div>
                        
                        {/* Tab Info */}
                        <div className="space-y-1">
                          <div className="font-semibold text-sm text-gray-300 truncate">{tab.title}</div>
                          <div className="text-xs text-gray-500 truncate">{tab.url}</div>
                        </div>
                        
                        {/* Close Button - Always Visible */}
                        <button 
                          className="absolute top-3 right-3 w-7 h-7 bg-red-600/80 backdrop-blur-sm border-none rounded-full text-gray-200 text-xs cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tab.id);
                          }}
                          title="Close tab"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        
                        {/* Active Indicator */}
                        {tab.id === activeTabId && (
                          <div className="absolute top-2 left-2 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Suspended Tabs Section */}
              {suspendedTabs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-600/20 rounded-full flex items-center justify-center">
                        <i className="fas fa-pause-circle text-gray-500 text-xs"></i>
                      </div>
                      <h3 className="text-gray-300 font-medium">Suspended Tabs</h3>
                      <span className="text-gray-500 text-sm">({suspendedTabs.length})</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {suspendedTabs.map(tab => (
                      <div key={tab.id} className="bg-gray-800/20 backdrop-blur-lg border border-gray-800/30 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:bg-gray-800/40 hover:border-gray-700/40 hover:shadow-lg">
                        {/* Tab Icon */}
                        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-lg bg-gray-900 border border-gray-800 p-1">
                          {/* Website Logo - using Google's favicon service */}
                          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${tab.url.replace('https://www.', '').replace('https://', '').split('/')[0]}&sz=32`}
                              alt="Website logo"
                              className="w-5 h-5 object-contain"
                              onError={(e) => {
                                // Fallback to letter if logo fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.fallback-letter');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'block';
                                }
                              }}
                            />
                            <div className="fallback-letter text-blue-500 text-sm font-bold" style={{display: 'none'}}>
                              {tab.icon.includes('globe') ? 'G' : 
                               tab.icon.includes('home') ? 'H' : 
                               tab.icon.includes('star') ? 'S' : 
                               tab.icon.includes('heart') ? '♥' : 
                               tab.icon.includes('bolt') ? '⚡' : 
                               tab.icon.includes('fire') ? '🔥' : 'T'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Tab Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-300 mb-1 truncate">{tab.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="fas fa-clock text-xs"></i>
                            {formatTimeDifference(tab.suspendedAt!)}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button 
                            className="w-9 h-9 bg-gray-600/20 border border-gray-600/30 rounded-full text-gray-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-gray-600/30 hover:text-gray-400 hover:scale-110 hover:shadow-lg hover:shadow-gray-600/20"
                            onClick={() => restoreSuspendedTab(tab.id)}
                            title="Restore tab"
                          >
                            <i className="fas fa-undo text-xs"></i>
                          </button>
                          <button 
                            className="w-9 h-9 bg-red-600/20 border border-red-600/30 rounded-full text-red-500 cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-red-600/30 hover:text-red-400 hover:scale-110 hover:shadow-lg hover:shadow-red-600/20"
                            onClick={() => deleteSuspendedTab(tab.id)}
                            title="Delete tab"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {tabs.length === 0 && suspendedTabs.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-700/20 to-slate-700/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <i className="fas fa-layer-group text-3xl text-gray-500"></i>
                  </div>
                  <div className="text-xl font-semibold text-gray-300 mb-2">No tabs yet</div>
                  <div className="text-gray-500 mb-6">Start browsing by creating your first tab</div>
                  <button 
                    className="bg-gradient-to-r from-gray-700 to-slate-700 text-gray-200 border-none px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-700/30 flex items-center justify-center gap-2 mx-auto"
                    onClick={createNewTab}
                  >
                    <i className="fas fa-plus"></i>
                    Create Your First Tab
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom Navigation */}
        <div className="h-[70px] bg-black/20 backdrop-blur-lg flex justify-around items-center border-t border-gray-800 relative z-100">
          <button 
            className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-300 py-2 relative h-full ${activeNav === 'back' ? 'bg-white/5' : ''}`}
            onClick={() => setActiveNav('back')}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"></div>
            <i className="fas fa-arrow-left text-2xl transition-all duration-300 text-gray-400 hover:-translate-y-0.5 hover:text-gray-200"></i>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-300 py-2 relative h-full ${activeNav === 'forward' ? 'bg-white/5' : ''}`}
            onClick={() => setActiveNav('forward')}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"></div>
            <i className="fas fa-arrow-right text-2xl transition-all duration-300 text-gray-400 hover:-translate-y-0.5 hover:text-gray-200"></i>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-300 py-2 relative h-full ${activeNav === 'home' ? 'bg-white/5' : ''}`}
            onClick={() => setActiveNav('home')}
          >
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${activeNav === 'home' ? 'w-[60%]' : 'w-0'}`}></div>
            <i className={`fas fa-home text-2xl transition-all duration-300 ${activeNav === 'home' ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' : 'text-gray-400 hover:-translate-y-0.5 hover:text-gray-200'}`}></i>
          </button>
          
          <button 
            id="tabsNav"
            className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-300 py-2 relative h-full ${activeNav === 'tabs' ? 'bg-white/5' : ''}`}
            onClick={() => {
              setActiveNav('tabs');
              setTabsOpen(true);
            }}
          >
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${activeNav === 'tabs' ? 'w-[60%]' : 'w-0'}`}></div>
            <i className={`fas fa-window-restore text-2xl transition-all duration-300 ${activeNav === 'tabs' ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' : 'text-gray-400 hover:-translate-y-0.5 hover:text-gray-200'}`}></i>
          </button>
          
          <button 
            id="menuToggle"
            className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-300 py-2 relative h-full ${activeNav === 'menu' ? 'bg-white/5' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveNav('menu');
              setMenuOpen(!menuOpen);
            }}
          >
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${activeNav === 'menu' ? 'w-[60%]' : 'w-0'}`}></div>
            <i className={`fas fa-bars text-2xl transition-all duration-300 ${activeNav === 'menu' ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' : 'text-gray-400 hover:-translate-y-0.5 hover:text-gray-200'}`}></i>
          </button>
        </div>
        
        {/* Menu Popup */}
        {menuOpen && (
          <div 
            id="menuPopup"
            className="absolute bottom-[70px] right-2.5 w-[300px] bg-black/20 backdrop-blur-lg rounded-2xl border border-gray-800 p-3.5 shadow-xl z-200 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {menuPages.map((page, pageIndex) => (
              <div 
                key={pageIndex}
                className={`menu-content ${menuPage === pageIndex + 1 ? 'block' : 'hidden'}`}
              >
                <div className={`grid grid-cols-3 gap-2.5 mb-3.5 ${page.items.length > 6 ? 'grid-rows-[auto_auto]' : ''}`}>
                  {page.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl cursor-pointer transition-all duration-200 bg-white/3 ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/8 hover:scale-105'}`}
                      onClick={() => !item.disabled && console.log(`Opening: ${item.text}`)}
                    >
                      <i className={`${item.icon} text-xl mb-1 text-white`}></i>
                      <div className="text-xs text-gray-400 text-center leading-tight">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Menu Dots Navigation */}
            <div className="flex justify-center gap-2 mt-2.5">
              {[1, 2, 3].map(pageNum => (
                <button
                  key={pageNum}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${menuPage === pageNum ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125' : 'bg-gray-500 hover:bg-gray-400'}`}
                  onClick={() => setMenuPage(pageNum)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Font Awesome Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}