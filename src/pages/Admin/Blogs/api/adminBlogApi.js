import api from '@/services/api';

export const adminBlogApi = {
    getCategories: () => api.get('/master-data/300/generals'),
    getBlogs: (params) => api.get('/articles', { params: { publishedOnly: false, ...params } }),
    getBlogDetails: (id) => api.get(`/articles/${id}`),
    createBlog: (data) => api.post('/articles', data),
    updateBlog: (id, data) => api.put(`/articles/${id}`, data),
    deleteBlog: (id) => api.delete(`/articles/${id}`),
    downloadGDoc: (url) => api.get('/media/download-gdoc', {
        params: { url },
        responseType: 'arraybuffer'
    })
};
