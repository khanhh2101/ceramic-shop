import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { selectTabs, selectActiveTabId } from '@/store/slices/tabsSlice';
import { adminRoutesMap } from '@/routes/adminRoutesMap';

export default function TabRenderer() {
  const tabs = useSelector(selectTabs);
  const activeTabId = useSelector(selectActiveTabId);

  return (
    <div className="flex-1 w-full h-full relative">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        // Resolve component based on path
        let Component = null;
        if (adminRoutesMap[tab.path]) {
          Component = adminRoutesMap[tab.path].component;
        } else {
          // Fallback matching
          const matchedKey = Object.keys(adminRoutesMap).find(key =>
            key !== '/admin' && tab.path.startsWith(key)
          );
          if (matchedKey) Component = adminRoutesMap[matchedKey].component;
        }

        if (!Component) return null;

        return (
          <div
            key={`${tab.id}-${tab.refreshKey || 0}`}
            className={`absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar ${isActive ? 'block z-10' : 'hidden z-0'}`}
          >
            <div className="p-2 sm:p-4 lg:p-6 mx-auto max-w-7xl h-full flex flex-col">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Đang tải {tab.title}...</p>
                  </div>
                </div>
              }>
                <Component />
              </Suspense>
            </div>
          </div>
        );
      })}
    </div>
  );
}
