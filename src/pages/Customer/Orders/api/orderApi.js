import { orderService, reviewService } from '@/services';

export const orderApi = {
    getMyOrders: () => orderService.getMyOrders(),
    getByCode: (orderCode) => orderService.getByCode(orderCode),
    getByTrackingToken: (token) => orderService.getByTrackingToken(token),
    createReview: (data) => reviewService.create(data)
};
