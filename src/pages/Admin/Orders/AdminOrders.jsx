import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiEye, FiSearch, FiFilter, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiX, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import ActionIconButton from '@/components/common/ActionIconButton';
import Button from '@/components/common/Button';
const PAYMENT_METHODS = {
  0: 'Thanh toán khi nhận hàng (COD)',
  1: 'Ví MoMo',
  2: 'VNPAY',
  3: 'Chuyển khoản ngân hàng'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [masterStatuses, setMasterStatuses] = useState([]);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const location = useLocation();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Handle opening modal if ?id= is present in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('id');
    if (orderId) {
      handleOpenModal(orderId);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await api.get('/master-data/400/generals'); // 400 is Order Status
        setMasterStatuses(res.data.data);
      } catch (err) {
        console.error('Failed to load order statuses', err);
      }
    };
    fetchMasterData();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { pageSize: 50 };
      if (statusFilter !== '') params.status = statusFilter;
      if (searchTerm.trim() !== '') params.search = searchTerm.trim();
      
      const res = await api.get('/orders/admin', { params });
      const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.items || []);
      setOrders(items);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (orderId) => {
    try {
      const res = await api.get(`/orders/code/${orderId}`);
      setSelectedOrder(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    
    // Warn if changing back from completed/cancelled
    if ((selectedOrder.statusId === 4000007 || selectedOrder.statusId === 4000008) && 
        !window.confirm('Đơn hàng này đã hoàn thành hoặc bị hủy. Bạn có chắc chắn muốn thay đổi trạng thái không?')) {
      return;
    }

    try {
      setUpdatingStatus(true);
      await api.patch(`/orders/${selectedOrder.id}/status`, { statusId: parseInt(newStatus) });
      toast.success('Cập nhật trạng thái thành công');
      
      // Update local state for the modal
      setSelectedOrder({ ...selectedOrder, statusId: parseInt(newStatus) });
      
      // Refresh the list
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const getImageUrl = (url) => {
    if (!url) return '/assets/image/placeholder.jpg';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    // Lấy baseUrl từ api instance (bỏ đi /api ở cuối nếu có)
    const baseUrl = api.defaults.baseURL?.replace(/\/api$/, '') || 'http://localhost:5011';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleSearch = () => {
    fetchOrders();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchOrders();
    }
  };

  return (
    <div className="p-2 space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">Đơn hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý và xử lý đơn đặt hàng</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 pl-10 pr-24 focus:ring-2 focus:ring-[#b5624a]/20 focus:border-[#b5624a] outline-none transition-all"
            placeholder="Tìm theo mã đơn, tên hoặc SĐT khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="absolute inset-y-1.5 right-1.5 px-3 bg-[#b5624a] hover:bg-[#8e4a36] text-white text-xs font-medium rounded-lg transition-colors"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#b5624a] outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="4000001">Chờ xác nhận</option>
            <option value="4000003">Đã thanh toán</option>
            <option value="4000005">Đang xử lý</option>
            <option value="4000006">Đang giao hàng</option>
            <option value="4000007">Hoàn tất</option>
            <option value="4000008">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#b5624a]/30 border-t-[#b5624a] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Mã Đơn</th>
                  <th className="px-6 py-4 font-medium">Khách Hàng</th>
                  <th className="px-6 py-4 font-medium">Sản Phẩm</th>
                  <th className="px-6 py-4 font-medium">Ngày Đặt</th>
                  <th className="px-6 py-4 font-medium">Tổng Tiền</th>
                  <th className="px-6 py-4 font-medium">Trạng Thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{order.orderCode || `#${order.id}`}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">{order.receiverName || 'Khách Hàng'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.receiverPhone || '---'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={getImageUrl(order.firstItemImage)} alt="" className="w-10 h-10 rounded object-cover border border-gray-100" />
                          <p className="text-xs text-gray-600">
                            {order.itemCount > 1 ? `${order.itemCount} sản phẩm` : '1 sản phẩm'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#b5624a]">{formatCurrency(order.total)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                          style={{ backgroundColor: order.statusColor || '#888' }}
                        >
                          {order.statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionIconButton 
                          icon={FiEye} 
                          text="Chi tiết"
                          variant="view"
                          onClick={() => handleOpenModal(order.id)} 
                        />
                      </td>
                    </tr>
                  )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAIL MODAL */}
      <Modal 
        isOpen={!!(isModalOpen && selectedOrder)} 
        onClose={handleCloseModal} 
        maxWidth="max-w-5xl"
      >
        {selectedOrder && (
          <>
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-3">
                  Chi tiết đơn hàng <span className="text-[#b5624a]">{selectedOrder?.orderCode || `#${selectedOrder?.id}`}</span>
                  <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                    style={{ backgroundColor: selectedOrder.statusColor || '#888' }}
                  >
                    {selectedOrder.statusText}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">Đặt lúc: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Cột 1: Thông tin & Địa chỉ */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Thông tin khách hàng</h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
                      <p><span className="text-gray-500">Họ tên:</span> <span className="font-semibold text-gray-900">{selectedOrder.receiverName}</span></p>
                      <p><span className="text-gray-500">SĐT:</span> {selectedOrder.receiverPhone}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedOrder.receiverEmail || 'Không có'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Giao hàng</h4>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
                      <p><span className="text-gray-500">Địa chỉ:</span> {selectedOrder.addressDetail}</p>
                      <p><span className="text-gray-500">Phường/Xã:</span> {selectedOrder.ward}</p>
                      <p><span className="text-gray-500">Quận/Huyện:</span> {selectedOrder.district}</p>
                      <p><span className="text-gray-500">Tỉnh/Thành:</span> {selectedOrder.province}</p>
                      {selectedOrder.note && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-gray-500 block mb-1">Ghi chú:</span>
                          <p className="italic text-gray-600">"{selectedOrder.note}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cột 2: Sản phẩm & Thanh toán */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Chi tiết sản phẩm</h4>
                    <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                      {selectedOrder.items?.map(item => (
                        <div key={item.id || item.productId} className="p-3 flex items-start justify-between gap-3">
                          <div className="flex gap-4">
                            <a href={getImageUrl(item.productImageUrl)} target="_blank" rel="noreferrer" className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                              <img src={getImageUrl(item.productImageUrl)} alt={item.productName} className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm" />
                            </a>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-base">{item.productName} {item.productCode && <span className="text-gray-500 font-normal ml-1">({item.productCode})</span>}</p>
                              {item.color && <p className="text-sm text-gray-500 mt-1">Màu: {item.color}</p>}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-[#b5624a] text-base">{formatCurrency(item.unitPrice)}</p>
                            <p className="text-sm text-gray-500 mt-1">SL: <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{formatCurrency(item.unitPrice * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Thanh toán</h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Phương thức:</span>
                        <span className="font-medium text-gray-900">{PAYMENT_METHODS[selectedOrder.paymentMethod] || 'Khác'}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Tạm tính:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(selectedOrder.subTotal)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Phí vận chuyển:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(selectedOrder.shippingFee)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Giảm giá:</span>
                          <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                        <span className="font-bold text-gray-900">TỔNG CỘNG:</span>
                        <span className="font-bold text-[#b5624a] text-lg">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer - Change Status */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              <div className="w-full sm:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Cập nhật trạng thái:</label>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.statusId}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#b5624a] outline-none disabled:opacity-50"
                  >
                    <option value="4000001">Chờ xác nhận</option>
                    <option value="4000002">Chờ thanh toán</option>
                    <option value="4000003">Đã thanh toán</option>
                    <option value="4000005">Đang xử lý</option>
                    <option value="4000006">Đang giao hàng</option>
                    <option value="4000007">Hoàn tất</option>
                    <option value="4000008">Đã hủy</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </Modal>

    </div>
  );
}
