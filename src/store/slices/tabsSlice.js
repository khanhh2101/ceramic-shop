import { createSlice } from '@reduxjs/toolkit';

// Try to load initial state from sessionStorage
const loadTabsState = () => {
  try {
    const serializedState = sessionStorage.getItem('adminTabsState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const initialState = loadTabsState() || {
  tabs: [],
  activeTabId: null,
  dirtyTabs: {}, // Track unsaved forms
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setTabDirty: (state, action) => {
      const { tabId, isDirty } = action.payload;
      if (!state.dirtyTabs) state.dirtyTabs = {};
      if (isDirty) {
        state.dirtyTabs[tabId] = true;
      } else {
        delete state.dirtyTabs[tabId];
      }
    },
    addTab: (state, action) => {
      const tab = action.payload; // { id, path, title }
      
      const existingTab = state.tabs.find(t => t.id === tab.id);
      
      if (state.tabs.length >= 15 && !existingTab) {
        return;
      }

      if (existingTab) {
        state.activeTabId = tab.id;
      } else {
        state.tabs.push({ ...tab, refreshKey: Date.now() });
        state.activeTabId = tab.id;
      }
    },
    removeTab: (state, action) => {
      const id = action.payload;
      if (id === '/admin') return; // Cannot remove Dashboard tab

      const index = state.tabs.findIndex(t => t.id === id);
      
      if (index !== -1) {
        state.tabs.splice(index, 1);
        
        // If we removed the active tab, switch to an adjacent one
        if (state.activeTabId === id) {
          if (state.tabs.length > 0) {
            const newIndex = Math.max(0, index - 1);
            state.activeTabId = state.tabs[newIndex].id;
          } else {
            state.activeTabId = null;
          }
        }
        // Cleanup dirty state
        if (state.dirtyTabs) {
          delete state.dirtyTabs[id];
        }
      }
    },
    closeAll: (state) => {
      const dashboardTab = state.tabs.find(t => t.id === '/admin');
      if (dashboardTab) {
        state.tabs = [dashboardTab];
        state.activeTabId = '/admin';
      }
    },
    closeOthers: (state, action) => {
      const id = action.payload || state.activeTabId;
      const tabToKeep = state.tabs.find(t => t.id === id);
      const dashboardTab = state.tabs.find(t => t.id === '/admin');
      
      const newTabs = [];
      if (dashboardTab) newTabs.push(dashboardTab);
      if (tabToKeep && tabToKeep.id !== '/admin') newTabs.push(tabToKeep);

      if (newTabs.length > 0) {
        state.tabs = newTabs;
        state.activeTabId = tabToKeep ? tabToKeep.id : '/admin';
      }
    },
    refreshTab: (state, action) => {
      const id = action.payload || state.activeTabId;
      const tab = state.tabs.find(t => t.id === id);
      if (tab) {
        tab.refreshKey = Date.now(); // Cập nhật refreshKey để ép re-render
      }
    },
    setActiveTab: (state, action) => {
      state.activeTabId = action.payload;
    },
    clearTabs: (state) => {
      state.tabs = [];
      state.activeTabId = null;
    }
  }
});

export const { addTab, removeTab, closeAll, closeOthers, refreshTab, setActiveTab, clearTabs, setTabDirty } = tabsSlice.actions;

export const selectTabs = (state) => state.tabs.tabs;
export const selectActiveTabId = (state) => state.tabs.activeTabId;
export const selectDirtyTabs = (state) => state.tabs.dirtyTabs || {};

export default tabsSlice.reducer;
