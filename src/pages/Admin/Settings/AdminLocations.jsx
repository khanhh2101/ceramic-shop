import { useState, useEffect } from 'react';
import { FiRefreshCw, FiMapPin, FiEdit2, FiSearch, FiCheck, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminLocationApi } from './api/adminLocationApi';
import { getErrorMessage } from '@/utils';

export default function AdminLocations() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [expandedProvinces, setExpandedProvinces] = useState({});
  const [expandedDistricts, setExpandedDistricts] = useState({});
  const [districtsData, setDistrictsData] = useState({}); // { provinceCode: [districts] }
  const [wardsData, setWardsData] = useState({}); // { parentCode: [wards] }

  // editingTarget: { type: 'province'|'district'|'ward', code, parentCode? }
  const [editingTarget, setEditingTarget] = useState(null);
  const [editForm, setEditForm] = useState({ shippingFee: '', zipCode: '' });

  const [isNewStructure, setIsNewStructure] = useState(false);

  useEffect(() => {
    fetchProvinces();
    // Reset expansions
    setExpandedProvinces({});
    setExpandedDistricts({});
  }, [isNewStructure]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const res = await adminLocationApi.getProvinces(isNewStructure);
      setProvinces(Array.isArray(res) ? res : (res?.data || res?.items || []));
    } catch (err) {
      toast.error('Lỗi khi tải danh sách Tỉnh/Thành phố');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (useNewStructure) => {
    const structName = useNewStructure ? 'Cấu trúc mới (Sau 1/7/2025)' : 'Cấu trúc cũ (Trước 1/7/2025)';
    if (!window.confirm(`Quá trình đồng bộ sẽ xóa dữ liệu hiện tại và tải lại từ tinhthanhpho.com theo ${structName}. Chú ý: Quá trình này có thể mất 1-2 phút. Bạn chắc chắn?`)) return;
    
    try {
      setSyncing(true);
      const res = await adminLocationApi.syncLocations(useNewStructure);
      toast.success(res.message || 'Đồng bộ thành công!');
      fetchProvinces();
    } catch (err) {
      /* toast handled by api */
    } finally {
      setSyncing(false);
    }
  };

  const toggleProvince = async (code) => {
    const isExpanded = !!expandedProvinces[code];
    setExpandedProvinces({ ...expandedProvinces, [code]: !isExpanded });
    
    if (!isExpanded) {
      try {
        if (!isNewStructure) {
          if (!districtsData[code]) {
            const res = await adminLocationApi.getDistricts(code, false);
            setDistrictsData(prev => ({ ...prev, [code]: res }));
          }
        } else {
          if (!wardsData[code]) {
            const res = await adminLocationApi.getWards(code, true);
            setWardsData(prev => ({ ...prev, [code]: res }));
          }
        }
      } catch (e) {
        toast.error('Lỗi khi tải dữ liệu con');
      }
    }
  };

  const toggleDistrict = async (districtCode) => {
    const isExpanded = !!expandedDistricts[districtCode];
    setExpandedDistricts({ ...expandedDistricts, [districtCode]: !isExpanded });
    
    if (!isExpanded && !wardsData[districtCode]) {
      try {
        const res = await adminLocationApi.getWards(districtCode, false);
        setWardsData(prev => ({ ...prev, [districtCode]: res }));
      } catch (e) {
        toast.error('Lỗi khi tải Phường/Xã');
      }
    }
  };

  const startEdit = (item, type, parentCode = null) => {
    setEditingTarget({ type, code: item.code, parentCode });
    setEditForm({
      shippingFee: item.shippingFee !== null ? item.shippingFee : '',
      zipCode: item.zipCode || ''
    });
  };

  const cancelEdit = () => {
    setEditingTarget(null);
  };

  const saveEdit = async () => {
    try {
      const payload = {
        shippingFee: editForm.shippingFee === '' ? null : Number(editForm.shippingFee)
      };

      if (editingTarget.type === 'province') {
        payload.zipCode = editForm.zipCode;
        await adminLocationApi.updateProvince(editingTarget.code, isNewStructure, payload);
        setProvinces(provinces.map(p => p.code === editingTarget.code ? { ...p, shippingFee: payload.shippingFee, zipCode: payload.zipCode } : p));
      } else if (editingTarget.type === 'district') {
        await adminLocationApi.updateDistrict(editingTarget.code, isNewStructure, payload);
        const parent = editingTarget.parentCode;
        setDistrictsData(prev => ({
          ...prev,
          [parent]: prev[parent].map(d => d.code === editingTarget.code ? { ...d, shippingFee: payload.shippingFee } : d)
        }));
      } else if (editingTarget.type === 'ward') {
        await adminLocationApi.updateWard(editingTarget.code, isNewStructure, payload);
        const parent = editingTarget.parentCode;
        setWardsData(prev => ({
          ...prev,
          [parent]: prev[parent].map(w => w.code === editingTarget.code ? { ...w, shippingFee: payload.shippingFee } : w)
        }));
      }

      toast.success('Cập nhật thành công!');
      setEditingTarget(null);
    } catch (err) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const filteredProvinces = provinces.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.zipCode && p.zipCode.includes(searchTerm))
  );

  const renderRow = (item, type, parentCode = null, depth = 0, fallbackFee = 0) => {
    const isEditing = editingTarget?.type === type && editingTarget?.code === item.code;
    const paddingLeft = depth * 32 + 24; // 24px base padding
    const hasChildren = type === 'province' || (type === 'district' && !isNewStructure);
    
    let isExpanded = false;
    let toggleFunc = null;
    
    if (type === 'province') {
      isExpanded = expandedProvinces[item.code];
      toggleFunc = () => toggleProvince(item.code);
    } else if (type === 'district') {
      isExpanded = expandedDistricts[item.code];
      toggleFunc = () => toggleDistrict(item.code);
    }

    const currentFee = item.shippingFee !== null && item.shippingFee !== undefined ? item.shippingFee : null;
    const displayFee = currentFee !== null ? currentFee : fallbackFee;
    const isInherited = currentFee === null;

    return (
      <div key={`${type}-${item.code}`} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${type === 'province' ? 'bg-white' : (type === 'district' ? 'bg-gray-50/50' : 'bg-gray-100/30')}`}>
        <div className="flex items-center justify-between py-3 px-6" style={{ paddingLeft: `${paddingLeft}px` }}>
          <div className="flex items-center gap-3 flex-1">
            {hasChildren ? (
              <button onClick={toggleFunc} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </button>
            ) : (
              <div className="w-6"></div> // spacer
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${type === 'province' ? 'text-gray-900' : 'text-gray-700'}`}>{item.name}</span>
                <span className="text-xs text-gray-400 font-mono">#{item.code}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 w-[400px] justify-end">
            {/* ZIP CODE (only province) */}
            {type === 'province' && (
              <div className="w-24">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.zipCode} 
                    onChange={e => setEditForm({...editForm, zipCode: e.target.value})}
                    className="w-full bg-white border border-[#b5624a] text-gray-900 text-sm rounded py-1 px-2 outline-none"
                    placeholder="Zip Code"
                  />
                ) : (
                  <span className="font-mono text-sm text-gray-500">{item.zipCode || '—'}</span>
                )}
              </div>
            )}

            {/* SHIPPING FEE */}
            <div className="w-40 text-right">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={editForm.shippingFee} 
                    onChange={e => setEditForm({...editForm, shippingFee: e.target.value})}
                    className="w-full bg-white border border-[#b5624a] text-gray-900 text-sm rounded py-1 px-2 outline-none text-right"
                    placeholder="Để trống = Mặc định"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-semibold ${isInherited ? 'text-gray-400' : 'text-[#b5624a]'}`}>
                    {displayFee.toLocaleString('vi-VN')} đ
                  </span>
                  {isInherited && <span className="text-[10px] text-gray-400">(Kế thừa)</span>}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="w-16 flex justify-end">
              {isEditing ? (
                <div className="flex gap-1">
                  <button onClick={saveEdit} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Lưu">
                    <FiCheck size={16} />
                  </button>
                  <button onClick={cancelEdit} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hủy">
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => startEdit(item, type, parentCode)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Sửa">
                  <FiEdit2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RENDER CHILDREN */}
        {isExpanded && type === 'province' && !isNewStructure && districtsData[item.code] && (
          <div className="border-t border-gray-100">
            {districtsData[item.code].map(d => renderRow(d, 'district', item.code, depth + 1, displayFee))}
          </div>
        )}

        {isExpanded && type === 'province' && isNewStructure && wardsData[item.code] && (
          <div className="border-t border-gray-100">
            {wardsData[item.code].map(w => renderRow(w, 'ward', item.code, depth + 1, displayFee))}
          </div>
        )}

        {isExpanded && type === 'district' && wardsData[item.code] && (
          <div className="border-t border-gray-100">
            {wardsData[item.code].map(w => renderRow(w, 'ward', item.code, depth + 1, displayFee))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-2 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
            <FiMapPin className="text-[#b5624a]" />
            Khu vực Giao hàng
          </h2>
          <div className="flex gap-4 mt-3 border-b border-gray-200">
            <button
              onClick={() => setIsNewStructure(false)}
              className={`pb-2 text-sm font-medium transition-colors ${!isNewStructure ? 'text-[#b5624a] border-b-2 border-[#b5624a]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cấu trúc Cũ (Trước 1/7/2025)
            </button>
            <button
              onClick={() => setIsNewStructure(true)}
              className={`pb-2 text-sm font-medium transition-colors ${isNewStructure ? 'text-[#b5624a] border-b-2 border-[#b5624a]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cấu trúc Mới (Từ 1/7/2025)
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Quản lý cấu trúc địa chỉ dạng Cây. Phí Ship của cấp con nếu bỏ trống sẽ tự động lấy theo cấp cha.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleSync(isNewStructure)}
            disabled={syncing}
            className="bg-[#b5624a] hover:bg-[#9a513b] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            title="Đồng bộ danh sách hiển thị từ tinhthanhpho.com"
          >
            <FiRefreshCw className={syncing ? "animate-spin" : ""} size={16} />
            {syncing ? 'Đang đồng bộ...' : `Đồng bộ (${isNewStructure ? 'Mới' : 'Cũ'})`}
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiSearch size={18} /></span>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
            placeholder="Tìm theo tên tỉnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">
          Tổng số: <span className="font-bold text-gray-900">{provinces.length}</span> tỉnh/thành
        </div>
      </div>

      {/* TREE LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between py-3 px-6 bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
          <div className="flex-1">Tên Đơn vị hành chính</div>
          <div className="flex items-center gap-8 w-[400px] justify-end">
            <div className="w-24 text-left">Zip Code</div>
            <div className="w-40 text-right">Phí giao hàng</div>
            <div className="w-16 text-right">Thao tác</div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[65vh]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
            </div>
          ) : filteredProvinces.length > 0 ? (
            filteredProvinces.map(p => renderRow(p, 'province'))
          ) : (
            <div className="p-12 text-center text-gray-500 text-sm">
              Chưa có dữ liệu Tỉnh/Thành phố. Vui lòng bấm "Đồng bộ API Quốc gia" để tải dữ liệu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
