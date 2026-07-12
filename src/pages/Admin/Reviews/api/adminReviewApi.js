import api from '@/services/api';

export const adminReviewApi = {
    getReviews: (params) => api.get('/reviews/admin', { params }),
    toggleStatus: (id) => api.patch(`/reviews/${id}/toggle`),
    deleteReview: (id) => api.delete(`/reviews/${id}`)
};
