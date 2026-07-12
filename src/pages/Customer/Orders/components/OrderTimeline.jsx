import React from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiX } from 'react-icons/fi';

export default function OrderTimeline({ order }) {
    if (!order) return null;

    if (order.statusId === 4000008 || order.statusId === 4000004) {
        return (
            <div className="order-timeline-card">
                <div className="order-timeline-failed">
                    <div className="order-timeline-failed-icon">
                        <FiX size={32} />
                    </div>
                    <h3 className="order-timeline-failed-title">
                        {order.statusId === 4000008 ? 'Đơn hàng đã bị hủy' : 'Thanh toán thất bại'}
                    </h3>
                    <p className="order-timeline-failed-desc">
                        {order.statusId === 4000008 
                            ? 'Đơn hàng của bạn đã được hủy. Nếu bạn đã thanh toán, chúng tôi sẽ hoàn tiền trong thời gian sớm nhất.' 
                            : 'Quá trình thanh toán không thành công. Vui lòng đặt lại đơn hàng mới.'}
                    </p>
                </div>
            </div>
        );
    }

    const stepOrderMap = { 4000001: 0, 4000002: 0, 4000003: 0, 4000005: 1, 4000006: 2, 4000007: 3 };
    const currentLevel = stepOrderMap[order.statusId] !== undefined ? stepOrderMap[order.statusId] : 0;
    const progressWidth = currentLevel === 0 ? '0%' : currentLevel === 1 ? '33.33%' : currentLevel === 2 ? '66.66%' : '100%';

    const steps = [
        { title: 'Chờ xác nhận', id: 4000001, icon: <FiPackage /> },
        { title: 'Đang xử lý', id: 4000005, icon: <FiPackage /> },
        { title: 'Đang giao', id: 4000006, icon: <FiTruck /> },
        { title: 'Hoàn thành', id: 4000007, icon: <FiCheckCircle /> }
    ];

    return (
        <div className="order-timeline-card">
            <div className="order-timeline-wrap">
                <div className="order-timeline-bar-bg"></div>
                
                <div 
                    className="order-timeline-bar-active" 
                    style={{ width: `calc(${progressWidth} * 0.8)` }}
                ></div>

                {steps.map((step, idx) => {
                    const stepLevel = stepOrderMap[step.id];
                    const isActive = currentLevel >= stepLevel;
                    const isCurrent = currentLevel === stepLevel;

                    return (
                        <div key={idx} className="order-timeline-step">
                            <div className={`order-timeline-step-icon ${isActive ? 'active' : 'inactive'} ${isCurrent ? 'current' : ''}`}>
                                {step.icon}
                            </div>
                            <div className={`order-timeline-step-title ${isActive ? 'active' : 'inactive'}`}>
                                {step.title}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
