import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiX, FiStar, FiEdit3 } from 'react-icons/fi';
import { renderStars } from '../utils.jsx';
import Modal from '@/components/common/Modal';

export default function ProductTabs({
    product,
    activeTab,
    setActiveTab,
    cleanDescription,
    reviews,
    loadingReviews,
    isAuth,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    reviewComment,
    setReviewComment,
    handleSubmitReview,
    submittingReview
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const getRatingText = (r) => {
        const map = { 1: t('product.ratingTerrible'), 2: t('product.ratingBad'), 3: t('product.ratingOk'), 4: t('product.ratingGood'), 5: t('product.ratingExcellent') };
        return map[r] || '';
    };

    const onSubmitReview = async () => {
        await handleSubmitReview();
        setIsReviewModalOpen(false);
    };

    return (
        <div className="details-tabs-wrap">
            <div className="details-tabs-nav">
                {['description', 'reviews'].map((tab) => (
                    <button
                        key={tab}
                        className={`details-tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'description' ? t('product.description')
                            : `${t('product.reviews')} (${product.reviewCount || 0})`}
                    </button>
                ))}
            </div>

            <div className="details-tabs-content">
                {/* ── TAB: Mô tả ── */}
                {activeTab === 'description' && (
                    <div className="animate-fade-in-up">
                        <div className="prose prose-sm md:prose-base max-w-none text-[#555] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: cleanDescription }}
                        />
                    </div>
                )}

                {/* ── TAB: Đánh giá ── */}
                {activeTab === 'reviews' && (
                    <div className="animate-fade-in-up space-y-8">
                        {/* Summary & Action */}
                        <div className="flex flex-col md:flex-row items-center justify-between bg-[#fcf9f5] p-6 md:p-8 rounded-2xl border border-[#f0e6d8]">
                            <div className="flex items-center gap-6 mb-6 md:mb-0">
                                <div className="text-center">
                                    <div className="text-4xl font-display text-[#c4a882] mb-1">{(product.averageRating || 0).toFixed(1)}</div>
                                    <div className="text-[13px] text-[#888] font-medium tracking-wide">{product.reviewCount || 0} {t('product.reviewCount')}</div>
                                </div>
                                <div className="hidden md:block w-px h-16 bg-[#e8d5c4]"></div>
                                <div>
                                    <div className="flex items-center gap-1.5 text-lg mb-2">
                                        {renderStars(product.averageRating || 0)}
                                    </div>
                                    <p className="text-[14px] text-[#555]">Đánh giá trung bình từ khách hàng</p>
                                </div>
                            </div>
                            
                            <div>
                                {isAuth ? (
                                    <button 
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className="flex items-center gap-2 bg-[#1a1a1a] text-[#c4a882] px-6 py-3 rounded-xl hover:bg-[#c4a882] hover:text-white transition-all duration-300 font-medium uppercase tracking-wider text-[13px] shadow-sm hover:shadow-md"
                                    >
                                        <FiEdit3 size={16} />
                                        {t('product.writeReview')}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => navigate('/auth/login')}
                                        className="flex items-center gap-2 bg-white border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 font-medium uppercase tracking-wider text-[13px]"
                                    >
                                        {t('nav.login')} để đánh giá
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Review Modal */}
                        <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} maxWidth="max-w-md">
                            <div className="relative p-6 md:p-8 bg-white">
                                <button 
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <FiX size={20} />
                                </button>

                                <div className="text-center mb-6">
                                    <h2 className="text-[24px] text-[#1a1a1a] mb-2 font-display">
                                        Chia Sẻ Cảm Nhận
                                    </h2>
                                    <p className="text-[13px] text-[#888] leading-relaxed px-4">
                                        Đánh giá của bạn về <strong>{product.name}</strong> giúp chúng tôi hoàn thiện chất lượng dịch vụ mỗi ngày.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col items-center py-2 border-y border-[#f0f0f0]">
                                        <div className="flex gap-2 py-4">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                                                >
                                                    <FiStar 
                                                        className={`w-9 h-9 transition-colors duration-300 ${
                                                            star <= (hoverRating || rating)
                                                                ? 'fill-[#c4a882] text-[#c4a882] drop-shadow-sm' 
                                                                : 'text-[#e5e7eb] hover:text-[#d1d5db]'
                                                        }`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="h-6 pb-4">
                                            <span className="text-[13px] font-medium text-[#c4a882] uppercase tracking-widest">
                                                {getRatingText(hoverRating || rating)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-[#f8f8f8] border border-transparent rounded-xl text-[14px] text-[#1a1a1a] transition-all duration-300 outline-none focus:bg-white focus:border-[#c4a882] focus:ring-4 focus:ring-[#c4a882]/10 min-h-[120px] resize-none placeholder:text-[#aaa]"
                                            placeholder="Chia sẻ trải nghiệm của bạn về độ hoàn thiện, màu sắc, thiết kế..."
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button 
                                            onClick={onSubmitReview}
                                            disabled={submittingReview || !reviewComment.trim()} 
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
                                </div>
                            </div>
                        </Modal>

                        {/* Review List */}
                        {loadingReviews ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="w-8 h-8 border-4 border-[#c4a882]/30 border-t-[#c4a882] rounded-full animate-spin"></div>
                                <p className="text-[#888] text-[13px] uppercase tracking-widest">{t('common.loading')}</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-16 bg-[#fafafa] rounded-2xl border border-dashed border-[#e0e0e0]">
                                <p className="text-[18px] text-[#1a1a1a] font-display mb-2">{t('product.noReviews')}</p>
                                <p className="text-[14px] text-[#888]">{t('product.beFirstReview')}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-[#f0f0f0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#f5ebe0] to-[#eaddcf] rounded-full flex items-center justify-center text-[#8b6f53] font-display text-xl shadow-inner">
                                                    {(review.userName || 'U')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong className="block text-[15px] font-medium text-[#1a1a1a] tracking-tight">{review.userName || 'Anonymous'}</strong>
                                                    <span className="text-[12px] text-[#888]">
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 text-[14px]">
                                                {renderStars(review.stars || review.rating || 0)}
                                            </div>
                                        </div>
                                        
                                        <div className="pl-16">
                                            {review.title && <p className="text-[15px] font-semibold text-[#1a1a1a] mb-2">{review.title}</p>}
                                            <p className="text-[14.5px] text-[#555] leading-relaxed mb-4 whitespace-pre-line">{review.content || review.comment || ''}</p>
                                            
                                            {review.imageUrls && review.imageUrls.length > 0 && (
                                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 snap-x">
                                                    {review.imageUrls.map((url, idx) => (
                                                        <img 
                                                            key={idx} 
                                                            src={url} 
                                                            alt="" 
                                                            className="w-24 h-24 object-cover rounded-xl border border-[#eee] snap-start hover:opacity-90 transition-opacity cursor-pointer" 
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
