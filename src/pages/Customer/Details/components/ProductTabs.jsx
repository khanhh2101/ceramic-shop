import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { renderStars } from '../utils.jsx';

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

    const getRatingText = (r) => {
        const map = { 1: t('product.ratingTerrible'), 2: t('product.ratingBad'), 3: t('product.ratingOk'), 4: t('product.ratingGood'), 5: t('product.ratingExcellent') };
        return map[r] || '';
    };

    return (
        <div className="details-tabs-wrap">
            <div className="details-tabs-nav">
                {['description', 'dimensions', 'reviews'].map((tab) => (
                    <button
                        key={tab}
                        className={`details-tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'description' ? t('product.description')
                            : tab === 'dimensions' ? t('product.specifications')
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

                {/* ── TAB: Thông số ── */}
                {activeTab === 'dimensions' && (
                    <div className="grid grid-cols-[130px_1fr] gap-y-3 max-w-[500px] text-[14px]">
                        <span className="font-medium text-[#1a1a1a]">{t('product.material')}</span>
                        <span className="text-[#555]">{product.material || '—'}</span>
                        <span className="font-medium text-[#1a1a1a]">{t('product.size')}</span>
                        <span className="text-[#555]">{product.specifications || '—'}</span>
                        {product.colors?.length > 0 && (
                            <>
                                <span className="font-medium text-[#1a1a1a]">{t('product.color')}</span>
                                <div className="flex gap-3 items-center flex-wrap">
                                    {product.colors.map((c) => (
                                        <span key={c.id || c.name} className="flex items-center gap-1.5">
                                            <span className="w-4 h-4 rounded-full inline-block border border-[#ddd]" style={{ backgroundColor: c.hexColor || '#ccc' }} />
                                            <span className="text-[13px] capitalize text-[#555]">{c.name}</span>
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── TAB: Đánh giá ── */}
                {activeTab === 'reviews' && (
                    <div>
                        {/* Review Summary */}
                        <div className="details-review-summary">
                            <div className="details-review-avg">
                                <div className="details-review-avg-num">{(product.averageRating || 0).toFixed(1)}</div>
                                <div className="details-review-avg-stars">{renderStars(product.averageRating || 0)}</div>
                                <div className="details-review-avg-count">{product.reviewCount || 0} {t('product.reviewCount')}</div>
                            </div>
                        </div>

                        {/* Review Form */}
                        {isAuth ? (
                            <div className="details-review-form-wrap">
                                <h4 className="details-review-form-title">
                                    {t('product.writeReview')}
                                </h4>
                                <div className="details-review-form-stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="details-review-star"
                                            style={{ color: star <= (hoverRating || rating) ? '#b5624a' : '#ddd' }}
                                        >
                                            <FaStar />
                                        </span>
                                    ))}
                                    <span className="details-review-star-text">{getRatingText(hoverRating || rating)}</span>
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="details-review-textarea"
                                    placeholder={t('product.reviewPlaceholder')}
                                />
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview}
                                    className="details-review-submit"
                                >
                                    {submittingReview ? t('product.submitting') : t('product.submitReview')}
                                </button>
                            </div>
                        ) : (
                            <div className="details-review-login">
                                {t('product.loginToReviewMsg')}{' '}
                                <span className="details-review-login-link" onClick={() => navigate('/auth/login')}>
                                    {t('nav.login')}
                                </span>
                            </div>
                        )}

                        {/* Review List */}
                        {loadingReviews ? (
                            <p className="text-[#aaa] text-[13px]">{t('common.loading')}</p>
                        ) : reviews.length === 0 ? (
                            <div className="details-review-empty">
                                <p className="details-review-empty-title">{t('product.noReviews')}</p>
                                <p className="details-review-empty-subtitle">{t('product.beFirstReview')}</p>
                            </div>
                        ) : (
                            <div>
                                {reviews.map((review) => (
                                    <div key={review.id} className="details-review-item">
                                        <div className="details-review-header">
                                            <div className="details-review-user">
                                                <div className="details-review-avatar">
                                                    {(review.userName || 'U')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <strong className="details-review-name">{review.userName || 'Anonymous'}</strong>
                                                    <span className="details-review-date">
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="details-review-stars">{renderStars(review.stars || review.rating || 0)}</div>
                                        </div>
                                        {review.title && <p className="details-review-title">{review.title}</p>}
                                        <p className="details-review-content">{review.content || review.comment || ''}</p>
                                        {review.imageUrls && review.imageUrls.length > 0 && (
                                            <div className="details-review-images">
                                                {review.imageUrls.map((url, idx) => (
                                                    <img key={idx} src={url} alt="" className="details-review-img" />
                                                ))}
                                            </div>
                                        )}
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
