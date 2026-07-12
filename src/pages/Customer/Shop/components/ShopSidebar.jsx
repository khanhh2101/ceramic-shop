export default function ShopSidebar({
    categories,
    masterColors,
    masterTags,
    selectedCategories,
    toggleCategory,
    selectedPrices,
    togglePrice,
    selectedColors,
    toggleColor,
    selectedTags,
    toggleTag
}) {
    const priceRanges = [
        { value: '0 - 100.000', label: '0 – 100.000 VND' },
        { value: '100.000 - 200.000', label: '100.000 – 200.000 VND' },
        { value: '200.000 - 9.999.999', label: 'Trên 200.000 VND' },
    ];

    return (
        <div className="space-y-8">
            {/* Danh mục */}
            <div>
                <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4 font-display">
                    Danh mục
                </h3>
                {categories.length === 0 && (
                    <p className="text-[12px] text-[#aaa]">Đang tải...</p>
                )}
                <div className="space-y-2.5">
                    {categories.map((item) => (
                        <label key={item.id} className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[var(--text)] group hover:text-[var(--dark)]">
                            <input
                                value={item.id}
                                type="checkbox"
                                checked={selectedCategories.includes(item.id)}
                                onChange={() => toggleCategory(item.id)}
                                className="w-4 h-4 accent-[#c4a882] cursor-pointer"
                            />
                            <span className="font-display">{item.name}</span>
                            {item.productCount > 0 && (
                                <span className="text-[#aaa] text-[11px] ml-1">({item.productCount})</span>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            {/* Giá */}
            <div>
                <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4 font-display">
                    Giá
                </h3>
                <div className="space-y-2.5">
                    {priceRanges.map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[var(--text)] group hover:text-[var(--dark)]">
                            <input
                                value={value}
                                type="checkbox"
                                checked={selectedPrices.includes(value)}
                                onChange={() => togglePrice(value)}
                                className="w-4 h-4 accent-[#c4a882] cursor-pointer"
                            />
                            <span className="font-display">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Màu sắc */}
            <div>
                <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4 font-display">
                    Màu sắc
                </h3>
                <div className="flex flex-wrap gap-2">
                    {masterColors.map(({ genCd, color, genNameVn }) => (
                        <div
                            key={genCd}
                            className={`w-7 h-7 rounded-full cursor-pointer transition-colors duration-200 border ${
                                selectedColors.includes(genCd) ? 'border-[var(--dark)]' : 'border-black/10'
                            } hover:border-[var(--dark)]`}
                            style={{
                                background: color || '#ccc',
                                outline: selectedColors.includes(genCd) ? '2px solid #b5624a' : 'none',
                            }}
                            title={genNameVn}
                            onClick={() => toggleColor(genCd)}
                        />
                    ))}
                </div>
            </div>

            {/* Thẻ (Tags) */}
            <div>
                <h3 className="text-[12px] tracking-[2px] uppercase text-[var(--dark)] border-b border-[var(--border)] pb-3 mb-4 font-display">
                    Nhãn nổi bật
                </h3>
                <div className="flex flex-wrap gap-2">
                    {masterTags.map(({ genCd, genNameVn, color }) => (
                        <button
                            key={genCd}
                            type="button"
                            onClick={() => toggleTag(genCd)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                selectedTags.includes(genCd) 
                                ? 'border-[#b5624a] ring-1 ring-[#b5624a]' 
                                : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: color || '#faf7f4', color: color ? '#fff' : '#8B6F47', border: color ? 'none' : '1px solid #e5ddd4' }}
                        >
                            {genNameVn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
