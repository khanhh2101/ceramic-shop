import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDatabase, FiGrid, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import ActionIconButton from '@/components/common/ActionIconButton';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/common/Button';

export default function AdminMasterData() {
  // ── State ──
  const [masters, setMasters] = useState([]);
  const [generals, setGenerals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGenerals, setLoadingGenerals] = useState(false);

  const [masterSearch, setMasterSearch] = useState('');
  const [generalSearch, setGeneralSearch] = useState('');

  const [selectedMaster, setSelectedMaster] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('master'); // 'master' | 'general'
  const [editingItem, setEditingItem] = useState(null);

  // Master form
  const [masterForm, setMasterForm] = useState({ code: '', name: '', seq: 0, isActive: true });

  // General form
  const [generalForm, setGeneralForm] = useState({
    genCd: '', genNameEn: '', genNameVn: '', isActive: true,
    number1: '', number2: '', number3: '',
    decimal1: '', decimal2: '', decimal3: '',
    string1: '', string2: '', string3: '',
    color: '',
    parent: '', seq: 0
  });

  useEffect(() => {
    fetchMasters();
  }, []);

  // ── Fetch ──

  const fetchMasters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/master-data');
      setMasters(res.data.data || []);
      // Auto-select first item if none selected
      if (!selectedMaster && res.data.data?.length > 0) {
        selectMaster(res.data.data[0]);
      } else if (selectedMaster) {
        // Refresh selected master data
        const updatedMaster = res.data.data.find(m => m.code === selectedMaster.code);
        if (updatedMaster) setSelectedMaster(updatedMaster);
      }
    } catch (err) {
      toast.error('Lỗi khi tải Master Data');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenerals = async (masterCode) => {
    try {
      setLoadingGenerals(true);
      const res = await api.get(`/master-data/${masterCode}/generals`);
      setGenerals(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi khi tải General Codes');
    } finally {
      setLoadingGenerals(false);
    }
  };

  const selectMaster = (master) => {
    setSelectedMaster(master);
    setGeneralSearch('');
    fetchGenerals(master.code);
  };

  // ── Modal ──

  const openMasterModal = (item = null) => {
    setModalType('master');
    if (item) {
      setEditingItem(item);
      setMasterForm({ code: item.code, name: item.name, seq: item.seq, isActive: item.isActive });
    } else {
      setEditingItem(null);
      setMasterForm({ code: '', name: '', seq: 0, isActive: true });
    }
    setIsModalOpen(true);
  };

  const openGeneralModal = async (item = null) => {
    setModalType('general');
    if (item) {
      setEditingItem(item);
      setGeneralForm({
        genCd: item.genCd, genNameEn: item.genNameEn, genNameVn: item.genNameVn, isActive: item.isActive,
        number1: item.number1 ?? '', number2: item.number2 ?? '', number3: item.number3 ?? '',
        decimal1: item.decimal1 ?? '', decimal2: item.decimal2 ?? '', decimal3: item.decimal3 ?? '',
        string1: item.string1 ?? '', string2: item.string2 ?? '', string3: item.string3 ?? '',
        color: item.color ?? '',
        parent: item.parent ?? '', seq: item.seq
      });
    } else {
      try {
        const res = await api.get(`/master-data/${selectedMaster.code}/next-gen-cd`);
        setGeneralForm({
          genCd: res.data.data, genNameEn: '', genNameVn: '', isActive: true,
          number1: '', number2: '', number3: '',
          decimal1: '', decimal2: '', decimal3: '',
          string1: '', string2: '', string3: '',
          color: '',
          parent: '', seq: 0
        });
      } catch {
        setGeneralForm({
          genCd: '', genNameEn: '', genNameVn: '', isActive: true,
          number1: '', number2: '', number3: '',
          decimal1: '', decimal2: '', decimal3: '',
          string1: '', string2: '', string3: '',
          color: '',
          parent: '', seq: 0
        });
      }
      setEditingItem(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // ── Submit ──

  const handleMasterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/master-data/${editingItem.code}`, {
          name: masterForm.name, seq: parseInt(masterForm.seq) || 0, isActive: masterForm.isActive
        });
        toast.success('Cập nhật Master Code thành công');
      } else {
        const res = await api.post('/master-data', {
          code: parseInt(masterForm.code), name: masterForm.name,
          seq: parseInt(masterForm.seq) || 0, isActive: masterForm.isActive
        });
        toast.success('Tạo Master Code thành công');
        selectMaster(res.data.data); // Select the newly created master
      }
      closeModal();
      fetchMasters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      genCd: parseInt(generalForm.genCd),
      genNameEn: generalForm.genNameEn,
      genNameVn: generalForm.genNameVn,
      isActive: generalForm.isActive,
      number1: generalForm.number1 !== '' ? parseInt(generalForm.number1) : null,
      number2: generalForm.number2 !== '' ? parseInt(generalForm.number2) : null,
      number3: generalForm.number3 !== '' ? parseInt(generalForm.number3) : null,
      decimal1: generalForm.decimal1 !== '' ? parseFloat(generalForm.decimal1) : null,
      decimal2: generalForm.decimal2 !== '' ? parseFloat(generalForm.decimal2) : null,
      decimal3: generalForm.decimal3 !== '' ? parseFloat(generalForm.decimal3) : null,
      string1: generalForm.string1 || null,
      string2: generalForm.string2 || null,
      string3: generalForm.string3 || null,
      color: generalForm.color || null,
      parent: generalForm.parent !== '' ? parseInt(generalForm.parent) : null,
      seq: parseInt(generalForm.seq) || 0
    };

    try {
      if (editingItem) {
        await api.put(`/master-data/generals/${editingItem.genCd}`, payload);
        toast.success('Cập nhật General Code thành công');
      } else {
        await api.post(`/master-data/${selectedMaster.code}/generals`, payload);
        toast.success('Tạo General Code thành công');
      }
      closeModal();
      fetchGenerals(selectedMaster.code);
      fetchMasters(); // Refresh counts
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // ── Delete ──

  const handleDeleteMaster = async (code, e) => {
    e.stopPropagation();
    if (!window.confirm('Xóa Master Code sẽ xóa luôn tất cả General Codes bên trong. Bạn chắc chắn?')) return;
    try {
      await api.delete(`/master-data/${code}`);
      toast.success('Đã xóa Master Code');
      if (selectedMaster?.code === code) setSelectedMaster(null);
      fetchMasters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  const handleDeleteGeneral = async (genCd) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa General Code này?')) return;
    try {
      await api.delete(`/master-data/generals/${genCd}`);
      toast.success('Đã xóa General Code');
      fetchGenerals(selectedMaster.code);
      fetchMasters(); // Refresh counts
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  // ── Filtering ──

  const filteredMasters = masters.filter(m =>
    m.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
    String(m.code).includes(masterSearch)
  );

  const filteredGenerals = generals.filter(g =>
    g.genNameEn.toLowerCase().includes(generalSearch.toLowerCase()) ||
    g.genNameVn.toLowerCase().includes(generalSearch.toLowerCase()) ||
    String(g.genCd).includes(generalSearch)
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all";

  return (
    <div className="p-2 h-[calc(100vh-6rem)] flex flex-col space-y-4">
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
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Tìm kiếm Master Code..." value={masterSearch} onChange={e => setMasterSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#b5624a]/20 outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-[#b5624a] border-t-transparent rounded-full animate-spin"></div></div>
            ) : filteredMasters.length > 0 ? (
              <div className="space-y-1">
                {filteredMasters.map(master => (
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
                  <div className="relative w-48">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Tìm kiếm..." value={generalSearch} onChange={e => setGeneralSearch(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#b5624a]/20 outline-none" />
                  </div>
                  <Button variant="primary" icon={FiPlus} onClick={() => openGeneralModal()}>
                    Thêm chi tiết
                  </Button>
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
                      {filteredGenerals.length > 0 ? filteredGenerals.map(gen => (
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
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
              <FiDatabase size={48} className="mb-4 text-gray-200" />
              <p>Chọn một Master Code bên trái để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* ══ MODAL ══ */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        contentClassName="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
      >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-900 font-display">
                {modalType === 'master'
                  ? (editingItem ? 'Cập nhật Nhóm (Master)' : 'Thêm Nhóm mới (Master)')
                  : (editingItem ? 'Cập nhật Mã Chi Tiết (General)' : `Thêm Mã Chi Tiết cho ${selectedMaster?.name}`)}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="overflow-y-auto flex-1 bg-gray-50/30">
              {modalType === 'master' ? (
                /* ── MASTER FORM ── */
                <form onSubmit={handleMasterSubmit} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã Nhóm (Code) *</label>
                      <input type="number" value={masterForm.code}
                        onChange={(e) => setMasterForm({ ...masterForm, code: e.target.value })}
                        className={inputClass} placeholder="VD: 100, 200..." required
                        disabled={!!editingItem} />
                      <p className="text-[11px] text-gray-500 mt-1.5">Mã không thay đổi được sau khi tạo.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên nhóm *</label>
                      <input type="text" value={masterForm.name}
                        onChange={(e) => setMasterForm({ ...masterForm, name: e.target.value })}
                        className={inputClass} placeholder="VD: Màu sắc, Địa chỉ..." required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thứ tự hiển thị (Seq)</label>
                      <input type="number" value={masterForm.seq}
                        onChange={(e) => setMasterForm({ ...masterForm, seq: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trạng thái</label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <button type="button"
                          onClick={() => setMasterForm({ ...masterForm, isActive: !masterForm.isActive })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${masterForm.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${masterForm.isActive ? 'left-[26px]' : 'left-0.5'}`}></span>
                        </button>
                        <span className={`text-sm font-medium ${masterForm.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {masterForm.isActive ? 'Hoạt động' : 'Tạm khóa'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Hủy bỏ</button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors">
                      {editingItem ? 'Lưu thay đổi' : 'Thêm Master Code'}
                    </button>
                  </div>
                </form>
              ) : (
                /* ── GENERAL FORM ── */
                <form onSubmit={handleGeneralSubmit} className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Thông tin cơ bản</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mã chi tiết (GenCd) *</label>
                        <input type="number" value={generalForm.genCd} onChange={(e) => setGeneralForm({ ...generalForm, genCd: e.target.value })}
                          className={inputClass} required disabled={!!editingItem} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái</label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <button type="button" onClick={() => setGeneralForm({ ...generalForm, isActive: !generalForm.isActive })}
                            className={`relative w-10 h-5 rounded-full transition-colors ${generalForm.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${generalForm.isActive ? 'left-[22px]' : 'left-0.5'}`}></span>
                          </button>
                          <span className={`text-xs font-medium ${generalForm.isActive ? 'text-green-600' : 'text-gray-500'}`}>{generalForm.isActive ? 'ON' : 'OFF'}</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tên Tiếng Việt *</label>
                        <input type="text" value={generalForm.genNameVn} onChange={(e) => setGeneralForm({ ...generalForm, genNameVn: e.target.value })}
                          className={inputClass} placeholder="VD: Trắng" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tên Tiếng Anh *</label>
                        <input type="text" value={generalForm.genNameEn} onChange={(e) => setGeneralForm({ ...generalForm, genNameEn: e.target.value })}
                          className={inputClass} placeholder="VD: White" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mã Cha (Parent GenCd)</label>
                        <input type="number" value={generalForm.parent} onChange={(e) => setGeneralForm({ ...generalForm, parent: e.target.value })}
                          className={inputClass} placeholder="VD: 3000001" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Thứ tự hiển thị (Seq)</label>
                        <input type="number" value={generalForm.seq} onChange={(e) => setGeneralForm({ ...generalForm, seq: e.target.value })}
                          className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Color dedicated block */}
                  <div className="bg-white p-4 rounded-xl border border-[#b5624a]/20 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: generalForm.color || '#e5e7eb' }} />
                      Màu sắc (Tùy chọn)
                    </h4>
                    <div className="flex items-center gap-3">
                      <label
                        className="relative w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer overflow-hidden shadow-md shrink-0 transition-transform hover:scale-105"
                        style={{ backgroundColor: generalForm.color || '#ffffff' }}
                        title="Nhấn để chọn màu"
                      >
                        <input
                          type="color"
                          value={generalForm.color || '#ffffff'}
                          onChange={(e) => setGeneralForm({ ...generalForm, color: e.target.value })}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </label>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mã Hex</label>
                        <input
                          type="text"
                          value={generalForm.color}
                          onChange={(e) => setGeneralForm({ ...generalForm, color: e.target.value })}
                          placeholder="#FFFFFF hoặc để trống"
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      {generalForm.color && (
                        <button
                          type="button"
                          onClick={() => setGeneralForm({ ...generalForm, color: '' })}
                          className="shrink-0 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >Xóa màu</button>
                      )}
                    </div>
                  </div>

                  {/* Extended Attributes */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 mb-4">Trường mở rộng (Tùy chọn)</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Strings */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chuỗi (String)</h5>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">String 1</label>
                          <input type="text" value={generalForm.string1} onChange={(e) => setGeneralForm({ ...generalForm, string1: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">String 2</label>
                          <input type="text" value={generalForm.string2} onChange={(e) => setGeneralForm({ ...generalForm, string2: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">String 3</label>
                          <input type="text" value={generalForm.string3} onChange={(e) => setGeneralForm({ ...generalForm, string3: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      {/* Numbers */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số nguyên (Number)</h5>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Number 1</label>
                          <input type="number" value={generalForm.number1} onChange={(e) => setGeneralForm({ ...generalForm, number1: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Number 2</label>
                          <input type="number" value={generalForm.number2} onChange={(e) => setGeneralForm({ ...generalForm, number2: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Number 3</label>
                          <input type="number" value={generalForm.number3} onChange={(e) => setGeneralForm({ ...generalForm, number3: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                      {/* Decimals */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số thập phân (Decimal)</h5>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Decimal 1</label>
                          <input type="number" step="0.0001" value={generalForm.decimal1} onChange={(e) => setGeneralForm({ ...generalForm, decimal1: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Decimal 2</label>
                          <input type="number" step="0.0001" value={generalForm.decimal2} onChange={(e) => setGeneralForm({ ...generalForm, decimal2: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-1">Decimal 3</label>
                          <input type="number" step="0.0001" value={generalForm.decimal3} onChange={(e) => setGeneralForm({ ...generalForm, decimal3: e.target.value })} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Hủy bỏ</button>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-[#b5624a] hover:bg-[#9a513b] rounded-xl transition-colors">
                      {editingItem ? 'Lưu thay đổi' : 'Thêm General Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
      </Modal>
    </div>
  );
}
