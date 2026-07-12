import React from 'react';

export default function WishlistHeroBanner() {
    return (
        <div className="relative h-[30vh] min-h-[250px] mb-12 flex items-center justify-center bg-[#faf7f4] overflow-hidden">
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop" 
                    alt="Yêu thích"
                    className="w-full h-full object-cover opacity-70 grayscale-[30%]"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto text-white">
                <h1 className="text-[32px] md:text-[42px] mb-3 font-display">
                    Danh sách yêu thích
                </h1>
                <p className="text-[14px] md:text-[15px] font-light opacity-90 max-w-[500px] mx-auto">
                    Lưu giữ những món đồ gốm bạn yêu thích để mua sau
                </p>
            </div>
        </div>
    );
}
