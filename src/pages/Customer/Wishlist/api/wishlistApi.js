import { productService } from '@/services';

export const wishlistApi = {
    getWishlistProducts: async (ids) => {
        const promises = ids.map(id => productService.getById(id));
        const responses = await Promise.allSettled(promises);
        
        return responses
            .filter(res => res.status === 'fulfilled' && res.value)
            .map(res => {
                const product = res.value?.data || res.value;
                // Ánh xạ các trường bị thiếu do getById trả về ProductDetailDto thay vì ProductListDto
                if (!product.primaryImageUrl && product.images && product.images.length > 0) {
                    const primaryImg = product.images.find(img => img.isPrimary) || product.images[0];
                    product.primaryImageUrl = primaryImg.url;
                }
                if (product.inStock === undefined) {
                    product.inStock = product.stockQuantity > 0;
                }
                return product;
            });
    }
};
