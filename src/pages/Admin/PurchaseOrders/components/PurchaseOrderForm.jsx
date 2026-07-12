import React, { useState, useEffect, useRef } from 'react';
import { adminPurchaseOrderApi } from '../api/adminPurchaseOrderApi';
import { adminProductApi } from '@/pages/Admin/Products/api/adminProductApi';
import { Search, Plus, Trash2, X, Save, PackageOpen, CheckCircle, ChevronRight, Hash, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PurchaseOrderForm({ onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [items, setItems] = useState([]);
  const [masterColors, setMasterColors] = useState([]);
  const [note, setNote] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const itemsEndRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchMasterColors();
    // Khóa cuộn trang nền khi mở Modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const fetchMasterColors = async () => {
    try {
      const resColor = await adminProductApi.getColors();
      const arr = Array.isArray(resColor) ? resColor : (resColor?.data || []);
      const mapped = arr.map(item => ({
        id: item.genCd,
        name: item.genNameVn,
        hexColor: item.color
      }));
      setMasterColors(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await adminProductApi.getProducts({ pageSize: 1000 });
      if (res?.isSuccess) {
        setProducts(res.data.data);
      } else if (res?.data) {
        setProducts(res.data.items || res.data.data || res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = (product) => {
    const defaultColor = product.colors?.length > 0 ? product.colors[0] : null;
    
    if (product.colors?.length > 0) {
      // Luôn thêm dòng mới nếu sản phẩm có màu (để admin có thể nhập nhiều màu)
      setItems([...items, {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        imageUrl: product.primaryImageUrl,
        quantity: 1,
        unitCost: product.costPrice || 0,
        colorId: defaultColor?.id || null,
        availableColors: product.colors || []
      }]);
      toast.success(`Đã thêm dòng mới: ${product.name}`);
    } else {
      // Sản phẩm không có màu: tăng số lượng nếu đã tồn tại
      const existsIndex = items.findIndex(i => i.productId === product.id);
      if (existsIndex >= 0) {
        const newItems = [...items];
        newItems[existsIndex].quantity += 1;
        setItems(newItems);
        toast.success(`Đã tăng số lượng: ${product.name}`);
      } else {
        setItems([...items, {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          imageUrl: product.primaryImageUrl,
          quantity: 1,
          unitCost: product.costPrice || 0,
          colorId: null,
          availableColors: []
        }]);
        toast.success(`Đã thêm: ${product.name}`);
      }
    }
    
    setTimeout(() => {
      itemsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'colorId' && value ? Number(value) : (field === 'colorId' ? null : Number(value));
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }

    const hasInvalidItems = items.some(i => i.quantity <= 0 || i.unitCost < 0);
    if (hasInvalidItems) {
      toast.error('Số lượng phải > 0 và giá vốn phải >= 0');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        supplierName: supplierName || 'Chưa xác định',
        note,
        orderDate,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitCost: i.unitCost,
          colorId: i.colorId
        }))
      };

      const res = await adminPurchaseOrderApi.createPurchaseOrder(payload);
      const isSuccess = res?.success || res?.isSuccess || res?.data?.success || res?.data?.isSuccess;
      if (isSuccess) {
        toast.success(res?.message || res?.data?.message || 'Tạo phiếu nhập thành công');
        onSuccess();
      } else {
        toast.error(res?.message || res?.data?.message || res?.error || 'Có lỗi xảy ra khi tạo phiếu nhập');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi tạo phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-[95vw] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white shrink-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Tạo Phiếu Nhập Kho</h3>
            <p className="text-sm text-gray-500 mt-0.5">Thêm sản phẩm và ghi nhận lô hàng mới từ nhà cung cấp</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <PackageOpen size={18} className="text-[#b5624a]" />
              <span className="text-sm font-semibold text-gray-700">{items.reduce((acc, curr) => acc + curr.quantity, 0)} items</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-gray-400"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-gray-50/50">
          {/* LEFT PANEL: PRODUCT SEARCH (35% Width) */}
          <div className="w-[35%] min-w-[350px] bg-white border-r border-gray-100 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-5 border-b border-gray-100 shrink-0">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Tìm theo tên hoặc mã SKU..." 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#b5624a] transition-colors" size={18} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {searchTerm && filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Search size={32} className="mb-2 opacity-30" />
                  <p className="text-sm font-medium">Không tìm thấy sản phẩm</p>
                </div>
              ) : (
                (searchTerm ? filteredProducts : products.slice(0, 50)).map(product => (
                  <div 
                    key={product.id}
                    onClick={() => handleAddItem(product)}
                    className="p-4 bg-white border border-gray-100 rounded-xl hover:border-[#b5624a]/40 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex justify-between items-center"
                  >
                    <div className="flex-1 min-w-0 pr-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={product.primaryImageUrl || 'https://placehold.co/150x150/f3f4f6/a1a1aa?text=Image'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-[#b5624a] transition-colors">{product.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Hash size={10} /> {product.sku}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {product.colors?.length > 0 ? (
                            <span>Tồn: <span className="font-bold text-[#b5624a]">{product.stockQuantity}</span> (Nhiều màu)</span>
                          ) : (
                            <span>Tồn: <span className={product.stockQuantity <= 5 ? "text-red-500 font-bold" : "text-gray-900 font-bold"}>{product.stockQuantity}</span></span>
                          )}
                        </span>
                      </div>
                      </div>
                    </div>
                    <button className="text-[#b5624a] bg-[#b5624a]/5 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 hover:bg-[#b5624a] hover:text-white">
                      <Plus size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: ORDER DETAILS (65% Width) */}
          <div className="w-[65%] flex flex-col relative bg-transparent">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" /> Danh sách hàng nhập
                  </h4>
                </div>

                {items.length === 0 ? (
                  <div className="py-32 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                    <PackageOpen size={56} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-gray-500 mb-1">Phiếu nhập đang trống</p>
                    <p className="text-sm">Hãy tìm và chọn sản phẩm ở danh sách bên trái</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                        <tr>
                          <th className="py-4 px-3 font-semibold">Sản phẩm</th>
                          <th className="py-4 px-3 font-semibold w-32">Màu sắc</th>
                          <th className="py-4 px-3 font-semibold text-center w-24">Số lượng</th>
                          <th className="py-4 px-3 font-semibold text-right w-36">Đơn giá (VNĐ)</th>
                          <th className="py-4 px-3 font-semibold text-right w-32">Thành tiền</th>
                          <th className="py-4 px-3 text-center w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="py-4 px-3 flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                <img src={item.imageUrl || 'https://placehold.co/150x150/f3f4f6/a1a1aa?text=Image'} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate max-w-[180px]">{item.name}</p>
                                <span className="text-xs text-gray-500 mt-1 block truncate">{item.sku}</span>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                                <select
                                  value={item.colorId || ''}
                                  onChange={(e) => handleUpdateItem(index, 'colorId', e.target.value)}
                                  className="w-full text-[13px] border border-gray-200 rounded-lg py-1.5 px-1 focus:border-[#b5624a] focus:ring-2 focus:ring-[#b5624a]/20 outline-none font-medium text-gray-900 transition-all truncate"
                                >
                                  <option value="">- Không màu -</option>
                                  {masterColors.map(c => {
                                      const stock = item.availableColors?.find(ac => ac.id === c.id)?.stockQuantity || 0;
                                      return (
                                          <option key={c.id} value={c.id}>{c.name} (Tồn: {stock})</option>
                                      );
                                  })}
                                </select>
                            </td>
                            <td className="py-4 px-3">
                              <input 
                                type="number" 
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                                className="w-full text-center text-sm border border-gray-200 rounded-lg py-1.5 focus:border-[#b5624a] focus:ring-2 focus:ring-[#b5624a]/20 outline-none font-bold text-gray-900 transition-all"
                              />
                            </td>
                            <td className="py-4 px-3">
                              <div className="relative">
                                <DollarSign size={14} className="absolute left-2 top-2.5 text-gray-400" />
                                <input 
                                  type="number" 
                                  min="0"
                                  value={item.unitCost}
                                  onChange={(e) => handleUpdateItem(index, 'unitCost', e.target.value)}
                                  className="w-full text-right text-sm border border-gray-200 rounded-lg py-1.5 pl-6 pr-2 focus:border-[#b5624a] focus:ring-2 focus:ring-[#b5624a]/20 outline-none font-bold text-gray-900 transition-all"
                                />
                              </div>
                            </td>
                            <td className="py-4 px-3 text-right font-black text-[#b5624a] text-[15px]">
                              {formatCurrency(item.quantity * item.unitCost)}
                            </td>
                            <td className="py-4 px-2 text-center">
                              <button 
                                onClick={() => handleRemoveItem(index)}
                                className="text-gray-400 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr ref={itemsEndRef} className="h-0"></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* General Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ChevronRight size={18} className="text-[#b5624a]" /> Thông Tin Nhập Hàng
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày lập phiếu</label>
                    <input 
                      type="date" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all font-semibold text-gray-900"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nhà cung cấp <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all font-semibold text-gray-900"
                      placeholder="Nhập tên đối tác/nhà cung cấp..."
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ghi chú phiếu nhập</label>
                    <textarea 
                      rows="2" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#b5624a]/10 focus:border-[#b5624a] transition-all font-medium text-gray-900 resize-none"
                      placeholder="Vd: Nhập hàng lô tháng 10..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="h-28"></div>
            </div>

            {/* STICKY FOOTER ACTION BAR */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-20 flex justify-between items-center rounded-br-2xl">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-500 mb-1">Tổng giá trị thanh toán:</span>
                <span className="text-4xl font-black text-[#b5624a] tracking-tight">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={onClose}
                  className="px-8 py-4 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 font-bold transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || items.length === 0 || !supplierName.trim()}
                  className="px-10 py-4 bg-[#b5624a] text-white rounded-xl hover:bg-[#9a513b] shadow-lg shadow-[#b5624a]/20 font-bold transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transform active:scale-95"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save size={20} />}
                  {loading ? 'Đang Xử Lý...' : 'Xác Nhận Nhập Hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
