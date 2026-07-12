import React from 'react';

export default function ContactForm({ register, handleSubmit, onSubmit, errors, isSubmitting }) {
    return (
        <div className="contact-right-col">
            <div className="contact-card h-full p-large">
                <h2 className="contact-card-title large">
                    Gửi Lời Nhắn
                </h2>
                <p className="contact-card-desc">
                    Điền thông tin vào biểu mẫu dưới đây, chúng tôi sẽ phản hồi qua Email hoặc Số điện thoại.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                    <div>
                        <label className="contact-label">Họ và tên *</label>
                        <input
                            type="text"
                            className="contact-input"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            {...register('name', { required: 'Vui lòng nhập họ tên' })}
                        />
                        {errors.name && <p className="contact-error">{errors.name.message}</p>}
                    </div>

                    <div className="contact-form-row">
                        <div>
                            <label className="contact-label">Email *</label>
                            <input
                                type="email"
                                className="contact-input"
                                placeholder="email@example.com"
                                {...register('email', { 
                                    required: 'Vui lòng nhập email',
                                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' }
                                })}
                            />
                            {errors.email && <p className="contact-error">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="contact-label">Số điện thoại</label>
                            <input
                                type="text"
                                className="contact-input"
                                placeholder="0912 345 678"
                                {...register('phone')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="contact-label">Chủ đề</label>
                        <input
                            type="text"
                            className="contact-input"
                            placeholder="Ví dụ: Tư vấn sản phẩm, Hợp tác sỉ..."
                            {...register('subject')}
                        />
                    </div>

                    <div>
                        <label className="contact-label">Lời nhắn *</label>
                        <textarea
                            className="contact-input contact-textarea"
                            placeholder="Nhập nội dung bạn muốn gửi cho Gốm Nâu..."
                            {...register('message', { required: 'Vui lòng nhập nội dung' })}
                        />
                        {errors.message && <p className="contact-error">{errors.message.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="contact-submit"
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi Thông Điệp'}
                    </button>
                </form>
            </div>
        </div>
    );
}
