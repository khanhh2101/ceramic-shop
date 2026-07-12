import { useState, useEffect, useCallback } from 'react';

/**
 * useSmartFilter Hook
 * Quản lý state cục bộ cho các tiêu chí lọc (filter), tìm kiếm (search) và phân trang (pagination).
 * Thay vì lưu lên URL (gây lỗi khi dùng Keep-Alive Tabs), state được lưu trong component và giữ nguyên khi chuyển tab.
 * Hỗ trợ Debounce cho ô tìm kiếm.
 * 
 * @param {Object} defaultFilters - Các filter mặc định (VD: { status: '', categoryId: '' })
 * @param {number} defaultPageSize - Page size mặc định
 * @param {number} debounceMs - Thời gian chờ Debounce
 * @param {string} prefix - Không còn bắt buộc do dùng local state, giữ lại để tương thích API cũ
 */
export function useSmartFilter(defaultFilters = {}, defaultPageSize = 20, debounceMs = 500, prefix = '') {
    // Core states
    const [pageIndex, setPageIndexState] = useState(1);
    const [pageSize, setPageSizeState] = useState(defaultPageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(defaultFilters);

    // Local state for search input to handle debounce
    const [searchInput, setSearchInput] = useState('');

    // Debounce Effect cho ô Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchTerm) {
                setSearchTerm(searchInput);
                setPageIndexState(1);
            }
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [searchInput, searchTerm, debounceMs]);

    // Các hàm Action tiện ích
    const setPageIndex = (page) => setPageIndexState(page);
    const setPageSize = (size) => {
        setPageSizeState(size);
        setPageIndexState(1);
    };
    
    const setFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageIndexState(1);
    };

    const clearFilters = () => {
        setSearchInput('');
        setSearchTerm('');
        setFilters(defaultFilters);
        setPageIndexState(1);
    };

    // Hàm gọi khi nhấn Enter ở ô Search (tùy chọn)
    const handleSearchImmediate = () => {
        if (searchInput !== searchTerm) {
            setSearchTerm(searchInput);
            setPageIndexState(1);
        }
    };

    // Dành cho tương thích ngược nếu component cũ gọi updateParams trực tiếp
    const updateParams = useCallback((newParams) => {
        console.warn('updateParams is deprecated in useSmartFilter. Use specific setters instead.');
    }, []);

    return {
        pageIndex,
        pageSize,
        searchTerm,
        searchInput,
        setSearchInput,
        filters,
        setFilter,
        setPageIndex,
        setPageSize,
        clearFilters,
        handleSearchImmediate,
        updateParams
    };
}
