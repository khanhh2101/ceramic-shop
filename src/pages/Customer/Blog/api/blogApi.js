import api from '@/services/api';

export const blogApi = {
    getArticles: () => api.get('/articles'),
    getArticleBySlug: (slug) => api.get(`/articles/${slug}`)
};
