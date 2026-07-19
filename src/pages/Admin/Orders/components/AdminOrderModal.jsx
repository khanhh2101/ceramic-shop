import { FiX } from 'react-icons/fi';
import Modal from '@/components/common/Modal';

const PAYMENT_METHODS = {
    0: 'Thanh toán khi nhận hàng (COD)',
    1: 'Ví MoMo',
    2: 'VNPAY',
    3: 'Chuyển khoản ngân hàng'
};

export default function AdminOrderModal({
    isModalOpen,
    handleCloseModal,
    selectedOrder,
    formatDate,
    formatCurrency,
    getImageUrl,
    updatingStatus,
    handleUpdateStatus
}) {
    return (
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
                                                        <p className="font-bold text-gray-900 text-base">
                                                            {item.productName} 
                                                            {(item.sku || item.productCode) && (
                                                                <span className="text-gray-500 font-normal ml-1">({item.sku || item.productCode})</span>
                                                            )}
                                                        </p>
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
                                                <span className="text-gray-500">Giảm giá{selectedOrder.couponCode ? ` (Mã: ${selectedOrder.couponCode})` : ''}:</span>
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
    );
}
