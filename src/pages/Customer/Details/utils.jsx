import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export const renderStars = (r) => {
    return Array.from({ length: 5 }, (_, i) => {
        const val = i + 1;
        if (r >= val) return <FaStar key={i} color="#b5624a" size={14} />;
        if (r >= val - 0.5) return <FaStarHalfAlt key={i} color="#b5624a" size={14} />;
        return <FaRegStar key={i} color="#ddd" size={14} />;
    });
};
