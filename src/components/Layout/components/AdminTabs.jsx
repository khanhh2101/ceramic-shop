import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectTabs, selectActiveTabId, selectDirtyTabs, addTab, removeTab, setActiveTab, refreshTab, closeOthers, closeAll } from '@/store/slices/tabsSlice';
import { adminRoutesMap } from '@/routes/adminRoutesMap';
import { 
  X, ChevronLeft, ChevronRight, RotateCw, XSquare, MinusSquare, ChevronDown, Layers,
  LayoutDashboard, Package, ShoppingBag, Users, FileText, 
  Tag, Ticket, Star, Image as ImageIcon, Database, 
  Settings, MapPin, FileBox, Archive
} from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

const getTabIcon = (path) => {
  if (!path) return FileBox;
  if (path === '/admin') return LayoutDashboard;
  if (path.startsWith('/admin/products')) return ShoppingBag;
  if (path.startsWith('/admin/categories')) return Tag;
  if (path.startsWith('/admin/inventory')) return Archive;
  if (path.startsWith('/admin/purchase-orders')) return Package;
  if (path.startsWith('/admin/coupons')) return Ticket;
  if (path.startsWith('/admin/orders')) return Package;
  if (path.startsWith('/admin/reviews')) return Star;
  if (path.startsWith('/admin/users')) return Users;
  if (path.startsWith('/admin/blogs')) return FileText;
  if (path.startsWith('/admin/media')) return ImageIcon;
  if (path.startsWith('/admin/master-data')) return Database;
  if (path.startsWith('/admin/settings')) return Settings;
  if (path.startsWith('/admin/locations')) return MapPin;
  return FileBox;
};

export default function AdminTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const tabs = useSelector(selectTabs);
  const activeTabId = useSelector(selectActiveTabId);
  const dirtyTabs = useSelector(selectDirtyTabs);
  const scrollContainerRef = useRef(null);

  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    tabId: null
  });

  const [dropdownMenu, setDropdownMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0
  });

  // Auto-add tab based on URL changes
  useEffect(() => {
    let currentPath = location.pathname;
    if (currentPath.length > 1 && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }
    
    // Find matching route config
    let targetTitle = 'Tab Mới';
    let isMatched = false;

    // Exact match first
    if (adminRoutesMap[currentPath]) {
      targetTitle = adminRoutesMap[currentPath].title;
      isMatched = true;
    } else {
      // Fallback: match by prefix if it's a nested route
      const matchedKey = Object.keys(adminRoutesMap).find(key => 
        key !== '/admin' && currentPath.startsWith(key)
      );
      if (matchedKey) {
        targetTitle = adminRoutesMap[matchedKey].title;
        isMatched = true;
      } else if (currentPath === '/admin') {
        targetTitle = adminRoutesMap['/admin'].title;
        isMatched = true;
      }
    }

    if (isMatched) {
      dispatch(addTab({
        id: currentPath,
        path: currentPath,
        title: targetTitle
      }));
    }
  }, [location.pathname, dispatch]);

  const isFirstRender = useRef(true);

  // Sync route when active tab changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Bỏ qua lần render đầu tiên để không ghi đè URL hiện tại bằng sessionStorage
    }

    let currentPath = location.pathname;
    if (currentPath.length > 1 && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    if (activeTabId && activeTabId !== currentPath) {
      navigate(activeTabId);
    }
  }, [activeTabId]); // ONLY depend on activeTabId to prevent loops

  // Persist tabs to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('adminTabsState', JSON.stringify({ tabs, activeTabId }));
  }, [tabs, activeTabId]);

  // Auto-scroll to ensure active tab is visible
  useEffect(() => {
    if (activeTabId && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-tab-id="${activeTabId}"]`);
      if (activeElement) {
        const container = scrollContainerRef.current;
        const tabRect = activeElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // If tab is outside the visible area, scroll it into view
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  }, [activeTabId, tabs]);

  const handleTabClick = (tab) => {
    if (activeTabId !== tab.id) {
      dispatch(setActiveTab(tab.id));
    }
  };

  const handleRemoveTab = (e, tab) => {
    e.stopPropagation(); // Ngăn trigger click mở tab
    e.preventDefault();

    if (dirtyTabs[tab.id]) {
      if (!window.confirm('Dữ liệu trên tab này chưa được lưu. Bạn có chắc chắn muốn đóng và mất dữ liệu không?')) {
        return;
      }
    }

    dispatch(removeTab(tab.id));
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // Context Menu Handlers
  const handleContextMenu = (e, tabId) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      tabId
    });
  };

  const closeContextMenu = () => {
    if (contextMenu.isOpen) {
      setContextMenu(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownMenu({
      isOpen: !dropdownMenu.isOpen,
      x: rect.right, // X aligned to the right edge of the button
      y: rect.bottom + 5 // Y just below the button
    });
  };

  const closeDropdownMenu = () => {
    if (dropdownMenu.isOpen) {
      setDropdownMenu(prev => ({ ...prev, isOpen: false }));
    }
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      closeContextMenu();
      closeDropdownMenu();
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [contextMenu.isOpen, dropdownMenu.isOpen]);

  const onRefreshTab = () => {
    dispatch(refreshTab(contextMenu.tabId));
  };

  const onCloseOthers = () => {
    const hasDirtyOthers = tabs.some(t => t.id !== contextMenu.tabId && dirtyTabs[t.id]);
    if (hasDirtyOthers) {
      if (!window.confirm('Một số tab khác đang có dữ liệu chưa lưu. Bạn có chắc chắn muốn đóng tất cả chúng?')) return;
    }
    dispatch(closeOthers(contextMenu.tabId));
  };

  const onCloseAll = () => {
    const hasDirty = tabs.some(t => t.id !== '/admin' && dirtyTabs[t.id]);
    if (hasDirty) {
      if (!window.confirm('Một số tab đang có dữ liệu chưa lưu. Bạn có chắc chắn muốn đóng tất cả?')) return;
    }
    dispatch(closeAll());
  };

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-end bg-[#f8fafc] pt-1 pr-2 relative z-0 h-11 border-b border-gray-200">
      <button 
        onClick={scrollLeft}
        className="p-0.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:outline-none flex-shrink-0 rounded-md mb-0.5 ml-1 mr-0.5 relative z-20"
      >
        <ChevronLeft size={16} />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex-1 flex items-end overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth whitespace-nowrap relative z-10 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const nextTab = tabs[index + 1];
          const isNextActive = nextTab && nextTab.id === activeTabId;
          const showSeparator = !isActive && !isNextActive && index !== tabs.length - 1;
          const TabIcon = getTabIcon(tab.path);
          
          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab)}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
              onMouseDown={(e) => {
                if (e.button === 1) e.preventDefault(); // Ngăn trình duyệt hiện icon cuộn khi bấm chuột giữa
              }}
              onAuxClick={(e) => { 
                if (e.button === 1 && tab.id !== '/admin') handleRemoveTab(e, tab); 
              }}
              className={`
                group flex items-center justify-between gap-1.5 px-3 py-[7px] min-w-[120px] max-w-[200px] cursor-pointer select-none transition-all mr-0.5
                relative border-transparent
                ${isActive 
                  ? 'text-primary font-bold z-20' 
                  : 'text-gray-500 hover:bg-gray-200/60 rounded-t-[8px] z-0'}
              `}
              title={tab.title}
            >
              {/* Separator like Chrome */}
              {showSeparator && (
                <div className="absolute right-[-1.5px] top-1/2 -translate-y-1/2 w-[1px] h-4 bg-gray-300 z-10 pointer-events-none transition-opacity opacity-100 group-hover:opacity-0" />
              )}

              {/* Pixel-perfect Chrome-like curves */}
              {isActive && (
                <>
                  {/* Background of active tab */}
                  <div className="absolute inset-0 bg-white rounded-t-[10px] pointer-events-none z-0"></div>

                  {/* Main Border (Top, Left, Right) stopping 6px above bottom to merge with curves */}
                  <div className="absolute top-0 left-0 right-0 bottom-[6px] border-t border-l border-r border-gray-200 rounded-t-[10px] pointer-events-none z-10"></div>

                  {/* Left Curve */}
                  <div className="absolute bottom-0 left-[-5px] w-[6px] h-[6px] overflow-hidden pointer-events-none z-10">
                     <div className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border border-gray-200 shadow-[0_0_0_10px_white]"></div>
                  </div>
                  
                  {/* Right Curve */}
                  <div className="absolute bottom-0 right-[-5px] w-[6px] h-[6px] overflow-hidden pointer-events-none z-10">
                     <div className="absolute bottom-0 left-0 w-[12px] h-[12px] rounded-full border border-gray-200 shadow-[0_0_0_10px_white]"></div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-center gap-1.5 overflow-hidden flex-1 relative z-20">
                <TabIcon size={14} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-[13px] font-medium truncate pt-[1px]`}>
                  {tab.title}
                </span>
              </div>
              
              {tab.id !== '/admin' && (
                <button 
                  onClick={(e) => handleRemoveTab(e, tab)}
                  className={`
                    p-0.5 rounded-full transition-colors relative z-20 shrink-0
                    ${isActive ? 'text-gray-400 hover:bg-primary/10 hover:text-red-500' : 'text-gray-400 hover:bg-gray-300 hover:text-gray-700 opacity-0 group-hover:opacity-100'}
                  `}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button 
        onClick={scrollRight}
        className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:outline-none flex-shrink-0 rounded-md mb-0.5 mx-0.5"
      >
        <ChevronRight size={16} />
      </button>

      {/* Nút hiển thị danh sách Tabs (Badge) */}
      <button 
        onClick={handleDropdownClick}
        className="relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:outline-none flex-shrink-0 rounded-md mb-0.5 mx-0.5"
        title="Danh sách Tabs"
      >
        <Layers size={16} />
        {tabs.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full border border-white shadow-sm leading-none">
            {tabs.length}
          </span>
        )}
      </button>

      {/* Context Menu (Portal) */}
      {contextMenu.isOpen && createPortal(
        <div 
          className="fixed z-[9999] w-48 bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 py-1 text-sm font-medium text-gray-700 animate-in fade-in zoom-in-95 duration-100"
          style={{ 
            top: contextMenu.y, 
            left: Math.min(contextMenu.x, window.innerWidth - 200) 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { onRefreshTab(); closeContextMenu(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left">
            <RotateCw size={14} /> Tải lại Tab
          </button>
          <div className="h-px bg-gray-200 my-1"></div>
          <button onClick={() => { onCloseOthers(); closeContextMenu(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left">
            <MinusSquare size={14} /> Đóng các Tab khác
          </button>
          <button onClick={() => { onCloseAll(); closeContextMenu(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left text-red-600 hover:text-red-700 hover:bg-red-50">
            <XSquare size={14} /> Đóng tất cả
          </button>
        </div>,
        document.body
      )}

      {/* Dropdown Menu (Portal) */}
      {dropdownMenu.isOpen && createPortal(
        <div 
          className="fixed z-[9999] w-56 bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 py-1 text-sm font-medium text-gray-700 animate-in fade-in slide-in-from-top-2 duration-100 max-h-80 overflow-y-auto custom-scrollbar"
          style={{ top: dropdownMenu.y, left: dropdownMenu.x - 224 /* 224px = w-56 */ }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1 bg-gray-50/50">
            Danh sách Tab đang mở ({tabs.length})
          </div>
          {tabs.map((tab) => {
            const TabIcon = getTabIcon(tab.path);
            const isActive = tab.id === activeTabId;
            return (
              <div 
                key={tab.id}
                onClick={() => { handleTabClick(tab); closeDropdownMenu(); }}
                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-left cursor-pointer group ${isActive ? 'bg-primary/5 text-primary font-bold' : ''}`}
              >
                <div className="flex items-center gap-2 truncate flex-1 pr-2">
                  <TabIcon size={14} className={isActive ? 'text-primary' : 'text-gray-500'} />
                  <span className="truncate">{tab.title}</span>
                </div>
                {tab.id !== '/admin' && (
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (dirtyTabs[tab.id]) {
                        if (!window.confirm('Dữ liệu trên tab này chưa được lưu. Bạn có chắc chắn muốn đóng?')) return;
                      }
                      dispatch(removeTab(tab.id)); 
                      if(tabs.length <= 2) closeDropdownMenu(); 
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>,
        document.body
      )}
      
      {/* Hide scrollbar styles via inline style tag for convenience */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
