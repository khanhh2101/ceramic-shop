import React from 'react';

export default function SupportContent({ activeTab }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-[#eee] p-8 md:p-12 min-h-[600px]">
            {activeTab === 'shipping' && (
                <div className="animate-fade-in text-[#333]">
                    <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">Chính Sách Giao Hàng</h2>
                    <div className="space-y-6 text-[15px] leading-[1.8] font-light">
                        <p>Gốm Nâu tự hào hợp tác cùng các đối tác vận chuyển uy tín để đảm bảo các sản phẩm gốm sứ thủ công đến tay bạn một cách an toàn và nguyên vẹn nhất.</p>
                        
                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">1. Thời gian giao hàng</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Nội thành TP.HCM & Hà Nội:</strong> Giao hàng trong vòng 1-2 ngày làm việc.</li>
                            <li><strong>Các tỉnh thành khác:</strong> Giao hàng từ 3-5 ngày làm việc tùy khu vực.</li>
                            <li>Đối với các sản phẩm đặt trước (Pre-order) hoặc chế tác theo yêu cầu, thời gian giao hàng có thể kéo dài từ 7-14 ngày.</li>
                        </ul>

                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">2. Phí vận chuyển</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Miễn phí vận chuyển (Freeship) toàn quốc cho đơn hàng từ <strong>1.500.000 VNĐ</strong>.</li>
                            <li>Đơn hàng tiêu chuẩn nội thành: 25.000 VNĐ.</li>
                            <li>Đơn hàng tiêu chuẩn ngoại thành/tỉnh: 35.000 VNĐ - 45.000 VNĐ.</li>
                        </ul>

                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">3. Quy cách đóng gói an toàn (Zero-Breakage)</h3>
                        <p>Mỗi món đồ gốm đều được gói 3 lớp: Giấy tổ khoảng (thân thiện môi trường), xốp bóng khí và hộp carton 5 lớp chuyên dụng, đảm bảo không nứt vỡ trong suốt quá trình vận chuyển.</p>
                    </div>
                </div>
            )}

            {activeTab === 'returns' && (
                <div className="animate-fade-in text-[#333]">
                    <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">Chính Sách Đổi Trả</h2>
                    <div className="space-y-6 text-[15px] leading-[1.8] font-light">
                        <p>Vì tính chất đặc thù của đồ gốm thủ công (mỗi sản phẩm là độc bản, kích thước hoặc màu men có thể lệch 1-2%), Gốm Nâu áp dụng chính sách đổi trả minh bạch để bảo vệ quyền lợi khách hàng.</p>
                        
                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">1. Điều kiện áp dụng đổi trả</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Sản phẩm bị nứt, vỡ, sứt mẻ do quá trình vận chuyển.</li>
                            <li>Sản phẩm được giao không đúng mẫu mã, màu sắc hoặc phân loại đã đặt.</li>
                            <li>Khách hàng cung cấp được video quay lại quá trình mở hộp (Unbox video) quay rõ 6 mặt hộp.</li>
                        </ul>

                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">2. Thời gian hỗ trợ</h3>
                        <p>Vui lòng liên hệ với Gốm Nâu trong vòng <strong>48 giờ</strong> kể từ thời điểm nhận hàng thành công trên hệ thống của đơn vị vận chuyển.</p>

                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">3. Các trường hợp TỪ CHỐI đổi trả</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Lỗ chân lông gốm (pinhole) nhỏ li ti hoặc vệt men chảy tự nhiên - Đây là đặc tính của gốm vuốt tay thủ công, không phải lỗi kỹ thuật.</li>
                            <li>Sản phẩm đã qua sử dụng, rửa nước hoặc rơi vỡ do lỗi từ phía khách hàng sau khi đã kiểm tra.</li>
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'care' && (
                <div className="animate-fade-in text-[#333]">
                    <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">Hướng Dẫn Bảo Quản</h2>
                    <div className="space-y-6 text-[15px] leading-[1.8] font-light">
                        <p>Để những món đồ gốm sứ luôn giữ được lớp men bóng bẩy và bền đẹp theo năm tháng, bạn hãy lưu ý những mẹo chăm sóc sau đây:</p>
                        
                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">Sử dụng hàng ngày</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Tất cả gốm của Gốm Nâu đều an toàn khi sử dụng trong <strong>Lò vi sóng</strong> và <strong>Máy rửa bát</strong>.</li>
                            <li>Tuy nhiên, tránh sự thay đổi nhiệt độ đột ngột (Sốc nhiệt). Ví dụ: Không lấy đĩa từ tủ đông và cho thẳng vào lò vi sóng.</li>
                            <li>Đối với các dòng gốm mộc (không tráng men bóng ở đáy), nên để sản phẩm khô hoàn toàn trước khi cất vào tủ để tránh nấm mốc ẩm.</li>
                        </ul>

                        <h3 className="text-[18px] font-medium text-[#1a1a1a] mt-8 mb-2">Vệ sinh đúng cách</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Với các vết cáu bẩn từ trà hoặc cà phê để lâu ngày, hãy ngâm với một chút baking soda và nước ấm trong 15 phút, sau đó rửa sạch bằng bọt biển mềm.</li>
                            <li>Tránh sử dụng bùi nhùi sắt hoặc miếng chà xát cứng lên bề mặt men bóng để tránh tạo ra các vết xước nhỏ.</li>
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'faq' && (
                <div className="animate-fade-in text-[#333]">
                    <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">Câu Hỏi Thường Gặp (FAQ)</h2>
                    <div className="space-y-6 text-[15px] leading-[1.8] font-light">
                        
                        <div className="bg-[#faf7f4] p-5 rounded-xl border border-[#eee]">
                            <h4 className="font-bold text-[#1a1a1a] mb-2">Hỏi: Men gốm tại Gốm Nâu có an toàn cho sức khỏe không?</h4>
                            <p>Đáp: Tuyệt đối an toàn. Chúng tôi cam kết sử dụng 100% men không chứa chì (Lead-free) và kim loại nặng, đạt tiêu chuẩn xuất khẩu. Bạn hoàn toàn yên tâm dùng để đựng thực phẩm nóng/lạnh mỗi ngày.</p>
                        </div>

                        <div className="bg-[#faf7f4] p-5 rounded-xl border border-[#eee]">
                            <h4 className="font-bold text-[#1a1a1a] mb-2">Hỏi: Tôi thấy sản phẩm nhận được có kích thước hơi khác với ảnh chụp?</h4>
                            <p>Đáp: Do 100% sản phẩm được nặn và vuốt bằng tay bởi các nghệ nhân, không qua đổ khuôn công nghiệp, nên kích thước có thể chênh lệch khoảng 0.5 - 1cm, và màu sắc men có thể đậm nhạt đôi chút tùy vị trí đặt trong lò nung. Đây là nét đẹp độc bản của gốm thủ công.</p>
                        </div>

                        <div className="bg-[#faf7f4] p-5 rounded-xl border border-[#eee]">
                            <h4 className="font-bold text-[#1a1a1a] mb-2">Hỏi: Gốm Nâu có nhận làm quà tặng doanh nghiệp hoặc in logo không?</h4>
                            <p>Đáp: Có. Chúng tôi có dịch vụ cung cấp quà tặng doanh nghiệp và cá nhân hóa in ấn logo, khắc tên. Vui lòng liên hệ Email: hello@gomnau.vn để được tư vấn chiết khấu tốt nhất.</p>
                        </div>

                    </div>
                </div>
            )}

            {activeTab === 'privacy' && (
                <div className="animate-fade-in text-[#333]">
                    <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">Chính Sách Bảo Mật</h2>
                    <div className="space-y-4 text-[15px] leading-[1.8] font-light">
                        <p>Gốm Nâu cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập các thông tin cần thiết (Tên, Số điện thoại, Địa chỉ, Email) để phục vụ cho việc giao hàng và chăm sóc khách hàng.</p>
                        <p>Mọi thông tin thanh toán qua thẻ tín dụng/ví điện tử đều được mã hóa an toàn thông qua cổng thanh toán VNPay/Momo của đối tác, chúng tôi không lưu trữ thông tin thẻ của bạn.</p>
                        <p>Gốm Nâu tuyệt đối KHÔNG mua bán, trao đổi dữ liệu khách hàng cho bên thứ ba dưới bất kỳ hình thức nào.</p>
                    </div>
                </div>
            )}

            {activeTab === 'terms' && (
                <div className="animate-fade-in text-[#333]">
                    <h2 className="text-[28px] text-[#1a1a1a] font-display mb-6 border-b border-[#eee] pb-4">Điều Khoản Dịch Vụ</h2>
                    <div className="space-y-4 text-[15px] leading-[1.8] font-light">
                        <p>Chào mừng bạn đến với Website thương mại điện tử của Gốm Nâu.</p>
                        <p>Bằng việc truy cập và mua hàng tại Gốm Nâu, bạn đồng ý với các quy định và chính sách đã được công bố trên website. Các nội dung, hình ảnh thiết kế, logo trên website đều thuộc bản quyền của thương hiệu Gốm Nâu, vui lòng không sao chép hoặc sử dụng cho mục đích thương mại mà không có sự cho phép.</p>
                        <p>Chúng tôi có quyền thay đổi giá bán sản phẩm hoặc cập nhật các điều khoản dịch vụ mà không cần báo trước, tuy nhiên giá mới sẽ chỉ áp dụng cho các đơn hàng mới phát sinh.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
