import { useState } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDatabase, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ActionIconButton from '@/components/common/ActionIconButton';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import { masterDataApi } from './api/masterDataApi';
import MasterFormModal from './components/MasterFormModal';
import GeneralFormModal from './components/GeneralFormModal';
import { getErrorMessage } from '@/utils';

export default function AdminMasterData() {
  const queryClient = useQueryClient();
  const {
      pageIndex: masterPageIndex,
      pageSize: masterPageSize,
      searchTerm: masterSearch,
      searchInput: masterSearchInput,
      setSearchInput: setMasterSearchInput,
      setPageIndex: setMasterPageIndex,
      clearFilters: clearMasterFilters,
      handleSearchImmediate: handleMasterSearchImmediate
  } = useSmartFilter({}, 20, 500, 'm_');

  const {
      pageIndex: generalPageIndex,
      pageSize: generalPageSize,
      searchTerm: generalSearch,
      searchInput: generalSearchInput,
      setSearchInput: setGeneralSearchInput,
      setPageIndex: setGeneralPageIndex,
      clearFilters: clearGeneralFilters,
      handleSearchImmediate: handleGeneralSearchImmediate
  } = useSmartFilter({}, 20, 500, 'g_');

  const [selectedMaster, setSelectedMaster] = useState(null);

  // Modal state
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const invalidateMasterCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['adminMasters'] });
    queryClient.invalidateQueries({ queryKey: ['adminGenerals'] });
  };

  // ── Fetch Masters ──
  const { data: mastersData, isLoading: loading } = useQuery({
    queryKey: ['adminMasters', { masterSearch, masterPageIndex, masterPageSize }],
    queryFn: async () => {
      const params = {};
      if (masterSearch.trim()) params.search = masterSearch.trim();
      
      const res = await masterDataApi.getMasters(params);
      const data = Array.isArray(res) ? res : (res?.data || res?.items || []);
      
      // Local pagination
      const totalCount = data.length;
      const totalPages = Math.ceil(totalCount / masterPageSize) || 1;
      const startIndex = (masterPageIndex - 1) * masterPageSize;
      const paginatedData = data.slice(startIndex, startIndex + masterPageSize);
      
      // Auto-select first item if none selected
      if (!selectedMaster && paginatedData.length > 0) {
        selectMaster(paginatedData[0]);
      } else if (selectedMaster) {
        const updatedMaster = data.find(m => m.code === selectedMaster.code);
        if (updatedMaster) setSelectedMaster(updatedMaster);
      }

      return {
        items: paginatedData,
        totalPages,
        totalCount
      };
    },
    placeholderData: keepPreviousData
  });

  const masters = mastersData?.items || [];
  const masterTotalPages = mastersData?.totalPages || 1;

  // ── Fetch Generals ──
  const { data: generalsData, isLoading: loadingGenerals } = useQuery({
    queryKey: ['adminGenerals', selectedMaster?.code, { generalSearch, generalPageIndex, generalPageSize }],
    queryFn: async () => {
      if (!selectedMaster?.code) return { items: [], totalPages: 1, totalCount: 0 };
      
      const params = {};
      if (generalSearch.trim()) params.search = generalSearch.trim();

      const res = await masterDataApi.getGenerals(selectedMaster.code, params);
      const data = Array.isArray(res) ? res : (res?.data || res?.items || []);
      
      // Local pagination
      const totalCount = data.length;
      const totalPages = Math.ceil(totalCount / generalPageSize) || 1;
      const startIndex = (generalPageIndex - 1) * generalPageSize;
      const paginatedData = data.slice(startIndex, startIndex + generalPageSize);

      return {
        items: paginatedData,
        totalPages,
        totalCount
      };
    },
    enabled: !!selectedMaster?.code,
    placeholderData: keepPreviousData
  });

  const generals = generalsData?.items || [];
  const generalTotalPages = generalsData?.totalPages || 1;

  const selectMaster = (master) => {
    setSelectedMaster(master);
    setGeneralSearch('');
    setGeneralSearchInput('');
    setGeneralPageIndex(1);
  };

  // ── Modal Actions ──
  const openMasterModal = (item = null) => {
    setEditingItem(item);
    setIsMasterModalOpen(true);
  };

  const openGeneralModal = (item = null) => {
    setEditingItem(item);
    setIsGeneralModalOpen(true);
  };

  // ── Delete ──
  const handleDeleteMaster = async (code, e) => {
    e.stopPropagation();
    if (!window.confirm('Xóa Master Code sẽ xóa luôn tất cả General Codes bên trong. Bạn chắc chắn?')) return;
    try {
      await masterDataApi.deleteMaster(code);
      toast.success('Đã xóa Master Code');
      if (selectedMaster?.code === code) setSelectedMaster(null);
      invalidateMasterCaches();
    } catch (err) {
      /* toast handled by api */
    }
  };

  const handleDeleteGeneral = async (genCd) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa General Code này?')) return;
    try {
      await masterDataApi.deleteGeneral(genCd);
      toast.success('Đã xóa General Code');
      invalidateMasterCaches();
    } catch (err) {
      /* toast handled by api */
    }
  };

  const handleMasterKeyDown = (e) => {
    if (e.key === 'Enter') handleMasterSearchImmediate();
  };

  const handleGeneralKeyDown = (e) => {
    if (e.key === 'Enter') handleGeneralSearchImmediate();
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-2 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
            <FiDatabase className="text-[#b5624a]" />
            Quản lý Master Data
          </h2>
        </div>
      </div>

      {/* SPLIT PANE */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

        {/* LEFT PANE: MASTER CODES */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FiGrid className="text-gray-400" /> Nhóm Dữ Liệu
              </h3>
              <Button size="sm" variant="primary" icon={FiPlus} onClick={() => openMasterModal()}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Tìm kiếm Master Code..." value={masterSearchInput} onChange={e => setMasterSearchInput(e.target.value)} onKeyDown={handleMasterKeyDown}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#b5624a]/20 outline-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleMasterSearchImmediate} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                  <FiSearch size={14} /> Tìm
                </button>
                <button onClick={clearMasterFilters} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium transition-colors" title="Làm mới">
                  <FiRefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-[#b5624a] border-t-transparent rounded-full animate-spin"></div></div>
            ) : masters.length > 0 ? (
              <div className="space-y-1">
                {masters.map(master => (
                  <div key={master.code} onClick={() => selectMaster(master)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between group
                      ${selectedMaster?.code === master.code
                        ? 'bg-[#b5624a]/5 border-[#b5624a]/30 shadow-sm'
                        : 'border-transparent hover:bg-gray-50'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${selectedMaster?.code === master.code ? 'bg-[#b5624a] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {master.code}
                        </span>
                        <span className={`font-semibold text-sm ${!master.isActive && 'text-gray-400 line-through'}`}>{master.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{master.generalCodeCount} mã chi tiết</p>
                    </div>
                    <div className={`flex items-center gap-1 opacity-100 transition-opacity ${selectedMaster?.code === master.code && 'opacity-100'}`}>
                      <ActionIconButton 
                        icon={FiEdit2} 
                        onClick={(e) => { e.stopPropagation(); openMasterModal(master); }} 
                      />
                      <ActionIconButton 
                        icon={FiTrash2} 
                        variant="delete" 
                        onClick={(e) => handleDeleteMaster(master.code, e)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 p-8">Chưa có Master Code nào.</p>
            )}

            {/* Pagination for Masters */}
            {!loading && masterTotalPages > 1 && (
                <div className="flex justify-center mt-2 p-2 border-t border-gray-100">
                    <Pagination 
                        currentPage={masterPageIndex}
                        totalPages={masterTotalPages}
                        onPageChange={(page) => setMasterPageIndex(page)}
                    />
                </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: GENERAL CODES */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          {selectedMaster ? (
            <>
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiList className="text-[#b5624a]" /> {selectedMaster.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Mã: {selectedMaster.code} • Trạng thái: {selectedMaster.isActive ? 'Bật' : 'Tắt'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative w-48 hidden sm:block">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Tìm kiếm..." value={generalSearchInput} onChange={e => setGeneralSearchInput(e.target.value)} onKeyDown={handleGeneralKeyDown}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#b5624a]/20 outline-none" />
                    </div>
                    <button onClick={handleGeneralSearchImmediate} className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 hidden sm:flex">
                      <FiSearch size={14} /> Tìm
                    </button>
                    <button onClick={clearGeneralFilters} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors hidden sm:flex" title="Làm mới">
                      <FiRefreshCw size={14} />
                    </button>
                    <Button variant="primary" icon={FiPlus} onClick={() => openGeneralModal()}>
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {loadingGenerals ? (
                  <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-[#b5624a] border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="sticky top-0 bg-gray-50/95 backdrop-blur z-10 shadow-sm">
                      <tr className="text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Gen Code</th>
                        <th className="px-6 py-4 font-medium">Tên (VN/EN)</th>
                        <th className="px-4 py-4 font-medium text-center w-24">Màu</th>
                        <th className="px-6 py-4 font-medium">Tham số</th>
                        <th className="px-6 py-4 font-medium text-center">Trạng Thái</th>
                        <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {generals.length > 0 ? generals.map(gen => (
                        <tr key={gen.genCd} className={`hover:bg-gray-50/50 transition-colors group ${!gen.isActive ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-semibold text-gray-900">{gen.genCd}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{gen.genNameVn}</div>
                            <div className="text-xs text-gray-500">{gen.genNameEn}</div>
                          </td>
                          {/* COLOR COLUMN */}
                          <td className="px-4 py-4 text-center">
                            {gen.color ? (
                              <div className="flex flex-col items-center gap-1">
                                <span
                                  className="inline-block w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200"
                                  style={{ backgroundColor: gen.color }}
                                  title={gen.color}
                                />
                                <span className="font-mono text-[10px] text-gray-500">{gen.color}</span>
                              </div>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2 max-w-xs">
                              {gen.number1 !== null && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">N1: {gen.number1}</span>}
                              {gen.decimal1 !== null && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">D1: {gen.decimal1}</span>}
                              {gen.parent !== null && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">P: {gen.parent}</span>}
                              {gen.string2 && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">S2: {gen.string2}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${gen.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <ActionIconButton 
                                icon={FiEdit2} 
                                onClick={() => openGeneralModal(gen)} 
                              />
                              <ActionIconButton 
                                icon={FiTrash2} 
                                variant="delete" 
                                onClick={() => handleDeleteGeneral(gen.genCd)} 
                              />
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                            Chưa có mã chi tiết nào trong nhóm này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination for Generals */}
              {!loadingGenerals && generalTotalPages > 1 && (
                  <div className="flex justify-center p-3 border-t border-gray-100 bg-white">
                      <Pagination 
                          currentPage={generalPageIndex}
                          totalPages={generalTotalPages}
                          onPageChange={(page) => setGeneralPageIndex(page)}
                      />
                  </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
              <FiDatabase size={48} className="mb-4 text-gray-200" />
              <p>Chọn một Master Code bên trái để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* ══ MODALS ══ */}
      <MasterFormModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        editingItem={editingItem}
        onSuccess={(savedMaster) => {
          invalidateMasterCaches();
          if (savedMaster && !editingItem) selectMaster(savedMaster);
        }}
      />
      
      <GeneralFormModal
        isOpen={isGeneralModalOpen}
        onClose={() => setIsGeneralModalOpen(false)}
        editingItem={editingItem}
        selectedMaster={selectedMaster}
        onSuccess={() => {
          invalidateMasterCaches();
        }}
      />
    </div>
  );
}
