import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function WishlistEmptyState() {
    return (
        <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#faf7f4] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c4a882] text-3xl">
                <FiHeart />
            </div>
            <h2 className="text-[20px] mb-4 text-[#1a1a1a] font-display">
                Danh sách trống
            </h2>
            <p className="text-[#888] mb-8 text-[14px]">
                Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
            </p>
            <Link 
                to="/shop" 
                className="inline-block px-8 py-3 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[2px] 
                            hover:bg-[#444] transition-colors duration-200"
            >
                Khám phá sản phẩm
            </Link>
        </div>
    );
}
