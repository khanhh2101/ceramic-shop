import api from '@/services/api';

export const productApi = {
    getProduct: (slug) => {
        const isNumeric = /^\d+$/.test(slug);
        const endpoint = isNumeric ? `/products/${slug}` : `/products/slug/${slug}`;
        return api.get(endpoint);
    },
    getReviews: (productId) => api.get(`/reviews/product/${productId}`),
    submitReview: (data) => api.post('/reviews', data),
    getSimilarProducts: (productId) => api.get(`/products/${productId}/similar`)
};
