import React from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import Modal from '@/components/common/Modal';

export default function ReviewModal({
    isOpen,
    onClose,
    selectedProduct,
    rating,
    setRating,
    regReview,
    handleReviewSubmit,
    errReview,
    onReviewSubmit,
    submittingReview
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
            <div className="relative p-6 md:p-8 bg-white">
                {/* Nút Đóng */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-[24px] text-[#1a1a1a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Chia Sẻ Cảm Nhận
                    </h2>
                    <p className="text-[13px] text-[#888] leading-relaxed px-4">
                        Đánh giá của bạn giúp chúng tôi hoàn thiện chất lượng dịch vụ mỗi ngày.
                    </p>
                </div>

                <form onSubmit={handleReviewSubmit(onReviewSubmit)} className="space-y-6">
                    {/* Sản phẩm */}
                    <div className="flex flex-col items-center justify-center gap-3 pb-6 border-b border-[#f0f0f0]">
                        <div className="w-20 h-20 bg-[#faf7f4] rounded-full shadow-inner overflow-hidden border border-[#eee]">
                            <img 
                                src={selectedProduct?.productImageUrl || 'https://placehold.co/600x800/eeeeee/999999?text=Gom+Nau'} 
                                alt={selectedProduct?.productName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-[14px] font-medium text-[#1a1a1a] text-center px-4" style={{ fontFamily: 'var(--font-display)' }}>
                            {selectedProduct?.productName}
                        </p>
                    </div>

                    {/* Chọn Sao */}
                    <div className="flex flex-col items-center py-2">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                                >
                                    <FiStar 
                                        className={`w-9 h-9 transition-colors duration-300 ${
                                            star <= rating 
                                                ? 'fill-[#c4a882] text-[#c4a882] drop-shadow-sm' 
                                                : 'text-[#e5e7eb] hover:text-[#d1d5db]'
                                        }`} 
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="h-6 mt-2">
                            <span className="text-[13px] font-medium text-[#c4a882] uppercase tracking-widest">
                                {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Tạm được' : rating === 1 ? 'Rất tệ' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Tiêu đề & Nội dung */}
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-transparent rounded-xl text-[14px] text-[#1a1a1a] transition-all duration-300 outline-none focus:bg-white focus:border-[#c4a882] focus:ring-4 focus:ring-[#c4a882]/10 placeholder:text-[#aaa]"
                                placeholder="Tiêu đề đánh giá (VD: Sản phẩm rất đẹp!)"
                                {...regReview('title', { required: 'Vui lòng nhập tiêu đề' })}
                            />
                            {errReview.title && <p className="text-[#e53e3e] text-[12px] mt-1.5 px-2">{errReview.title.message}</p>}
                        </div>

                        <div>
                            <textarea
                                className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-transparent rounded-xl text-[14px] text-[#1a1a1a] transition-all duration-300 outline-none focus:bg-white focus:border-[#c4a882] focus:ring-4 focus:ring-[#c4a882]/10 min-h-[120px] resize-none placeholder:text-[#aaa]"
                                placeholder="Chia sẻ trải nghiệm của bạn về độ hoàn thiện, màu sắc, thiết kế..."
                                {...regReview('content', { required: 'Vui lòng nhập nội dung đánh giá' })}
                            ></textarea>
                            {errReview.content && <p className="text-[#e53e3e] text-[12px] mt-1.5 px-2">{errReview.content.message}</p>}
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={submittingReview} 
                            className="w-full py-4 text-[13px] uppercase tracking-[2px] font-medium bg-[#1a1a1a] text-[#c4a882] hover:bg-[#c4a882] hover:text-white hover:shadow-lg transition-all duration-300 rounded-xl disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {submittingReview ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-[#c4a882]/30 border-t-[#c4a882] rounded-full animate-spin"></span>
                                    Đang gửi...
                                </>
                            ) : (
                                'Gửi Đánh Giá'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
