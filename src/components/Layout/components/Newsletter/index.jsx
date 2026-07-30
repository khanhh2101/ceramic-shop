function Newsletter() {
    return (
        <div className="bg-[#f5e9d9] text-center py-[72px] px-5 relative overflow-hidden">
            <div className="text-[80px] opacity-15 absolute -bottom-2.5 left-5 -rotate-[20deg] pointer-events-none select-none">
                🏷️
            </div>

            <h2
                className="mb-4 font-normal text-[32px] md:text-[40px] text-[var(--dark)]"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                Đăng ký nhận tin từ Champa Clay
            </h2>

            <p className="text-[14px] text-[#888] mb-1">
                Theo dõi những bộ sưu tập mới, câu chuyện về nghề gốm Chăm Bàu
                Trúc cùng các ưu đãi dành riêng cho thành viên.
            </p>

            <p className="text-[13px] text-[#888] mb-7">
                Nhận ưu đãi giảm 50.000 VND cho đơn hàng đầu tiên khi đăng ký.
            </p>

            <div className="flex justify-center w-full max-w-md mx-auto">
                <input
                    className="p-3.5 px-5 border border-[#ddd] border-r-0 w-full md:w-[320px] 
                               text-[13px] outline-none bg-white focus:border-[#c4a882] transition-colors"
                    style={{ fontFamily: 'inherit' }}
                    type="email"
                    placeholder="Your Email"
                />
                <button
                    className="bg-[#1a1a1a] text-white border-none py-3.5 px-7 text-[13px] 
                               cursor-pointer hover:bg-[#444] transition-colors duration-200"
                    style={{ fontFamily: 'inherit' }}
                >
                    Subscribe
                </button>
            </div>
        </div>
    );
}

export default Newsletter;
