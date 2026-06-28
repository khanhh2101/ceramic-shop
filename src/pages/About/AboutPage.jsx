import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiGlobe, FiArrowRight, FiInstagram } from 'react-icons/fi';
import api from '../../services/api';

export default function AboutPage() {
    const [brandStory, setBrandStory] = useState({});

    useEffect(() => {
        api.get('/settings/home').then(res => {
            const blocks = res.data.data || [];
            const storyBlock = blocks.find(b => b.blockKey === 'brand_story');
            if (storyBlock) {
                try {
                    setBrandStory(JSON.parse(storyBlock.dataJson));
                } catch (e) {
                    console.error('Error parsing brand_story', e);
                }
            }
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-[#faf7f4] min-h-screen">
            {/* HERO SECTION - CLEAN FULL WIDTH */}
            <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden rounded-b-[40px] md:rounded-b-[80px]">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop" 
                        alt="Gốm Nâu Workshop"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30"></div>
                </div>
                
                <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto pt-20">
                    <div className="inline-block px-4 py-1.5 bg-[#b5624a] text-white rounded-full text-[11px] font-bold tracking-[3px] uppercase mb-6 shadow-md">
                        Về Chúng Tôi
                    </div>
                    <h1 className="text-[48px] md:text-[64px] lg:text-[80px] text-white mb-6 leading-[1.1] font-display drop-shadow-lg">
                        Thổi Hồn <br className="hidden md:block" /> Vào Đất Mẹ
                    </h1>
                    <p className="text-[16px] md:text-[20px] text-white/90 font-light leading-[1.8] mb-10 max-w-[600px] mx-auto drop-shadow-md">
                        Chúng tôi tin rằng mỗi món đồ gốm đều mang trong mình một linh hồn, một câu chuyện được nặn thành hình từ đôi bàn tay nhẫn nại và tình yêu với tự nhiên.
                    </p>
                    <Link 
                        to="/shop" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1a1a1a] rounded-full text-[14px] font-medium 
                                 hover:bg-[#f5ebe0] hover:text-[#b5624a] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                    >
                        Khám phá cửa hàng <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* NUMBERS/STATS SECTION */}
            <div className="py-16 md:py-24 px-5">
                <div className="max-w-[1000px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-[#e8dccb]">
                        <div className="text-center">
                            <div className="text-[40px] md:text-[56px] font-display text-[#1a1a1a] mb-2 leading-none">5+</div>
                            <div className="text-[13px] text-[#888] uppercase tracking-[2px] font-medium">Năm Thành Lập</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[40px] md:text-[56px] font-display text-[#1a1a1a] mb-2 leading-none">20+</div>
                            <div className="text-[13px] text-[#888] uppercase tracking-[2px] font-medium">Nghệ Nhân Mộc</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[40px] md:text-[56px] font-display text-[#1a1a1a] mb-2 leading-none">10k</div>
                            <div className="text-[13px] text-[#888] uppercase tracking-[2px] font-medium">Sản Phẩm Bán Ra</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[40px] md:text-[56px] font-display text-[#1a1a1a] mb-2 leading-none">100%</div>
                            <div className="text-[13px] text-[#888] uppercase tracking-[2px] font-medium">Làm Thủ Công</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OUR STORY - PLAYFUL LAYOUT */}
            <div className="py-16 md:py-24 px-5 md:px-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-5 relative">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#e8dccb] rounded-full mix-blend-multiply opacity-70 animate-pulse"></div>
                            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#f5ebe0] rounded-full mix-blend-multiply opacity-70"></div>
                            <img 
                                src={brandStory.image || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"} 
                                alt="Ceramic Collection" 
                                className="relative z-10 w-full aspect-[4/5] object-cover rounded-[40px] shadow-xl"
                            />
                        </div>
                        
                        <div className="md:col-span-7 md:pl-10 lg:pl-16">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[2px] w-12 bg-[#b5624a]"></div>
                                <span className="text-[#b5624a] uppercase tracking-[2px] text-[13px] font-bold">Hành Trình Gốm Nâu</span>
                            </div>
                            <h2 className="text-[36px] md:text-[48px] text-[#1a1a1a] mb-8 leading-[1.2] font-display" dangerouslySetInnerHTML={{ __html: brandStory.title?.replace('\n', '<br/>') || 'Từ đất sét vô tri <br/> đến tổ ấm của bạn.' }}>
                            </h2>
                            <div className="space-y-6 text-[#555] text-[16px] leading-[1.8] font-light">
                                <p dangerouslySetInnerHTML={{ __html: brandStory.content?.replace(/\n/g, '<br/>') || 'Năm 2018, chúng tôi là những người trẻ đam mê nghệ thuật thị giác và phong cách sống tối giản. Đứng trước sự lên ngôi của đồ nhựa và đồ công nghiệp, Gốm Nâu ra đời như một nốt trầm tĩnh lặng.' }}></p>
                                <p>
                                    Chúng tôi đi khắp các xưởng gốm lâu đời, làm việc cùng những nghệ nhân tâm huyết nhất. Mỗi sản phẩm tại Gốm Nâu là sự kết hợp giữa kỹ thuật thủ công truyền thống và hơi thở thiết kế đương đại: trẻ trung, thanh lịch và mang đậm tính ứng dụng.
                                </p>
                                <p className="font-medium text-[#1a1a1a] italic border-l-4 border-[#c4a882] pl-4">
                                    "Chúng tôi không bán đồ vật. Chúng tôi bán một phong cách sống bình yên."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUOTE BANNER SECTION */}
            <div className="py-24 px-5">
                <div className="max-w-[800px] mx-auto text-center">
                    <svg className="w-12 h-12 mx-auto text-[#e8dccb] mb-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <h3 className="text-[28px] md:text-[40px] text-[#1a1a1a] font-display leading-[1.4] mb-8">
                        Vẻ đẹp thực sự không nằm ở sự hoàn hảo không tì vết, mà nằm ở những dấu ấn độc bản của tự nhiên và bàn tay con người.
                    </h3>
                    <p className="text-[14px] text-[#888] uppercase tracking-[3px] font-bold">— Founder Gốm Nâu —</p>
                </div>
            </div>

            {/* CORE VALUES - IMAGE CARDS */}
            <div className="py-20 md:py-24 px-5 md:px-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-[36px] md:text-[48px] text-[#1a1a1a] mb-4 font-display">
                            Giá Trị Cốt Lõi
                        </h2>
                        <p className="text-[#888] text-[16px] max-w-[600px] mx-auto font-light">
                            Ba viên gạch nền móng tạo nên triết lý hoạt động và mọi sản phẩm của Gốm Nâu.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Card 1 */}
                        <div className="relative h-[450px] lg:h-[550px] rounded-[40px] overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" 
                                alt="Chất Lượng Thật" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-left text-white">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/30">
                                    <FiTarget size={24} />
                                </div>
                                <h3 className="text-[28px] text-white mb-3 font-display drop-shadow-md">Chất Lượng Thật</h3>
                                <p className="text-white/80 text-[14px] leading-[1.7] font-light">
                                    Đất sét tự nhiên, men gốm 100% không chứa chì. Đảm bảo an toàn sức khỏe tuyệt đối.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative h-[450px] lg:h-[550px] rounded-[40px] overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl md:translate-y-8">
                            <img 
                                src="https://images.unsplash.com/photo-1590403759392-802c617b4458?q=80&w=800&auto=format&fit=crop" 
                                alt="Thủ Công Độc Bản" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#5c4a3d]/90 via-[#5c4a3d]/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-left text-white">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/30">
                                    <FiHeart size={24} />
                                </div>
                                <h3 className="text-[28px] text-white mb-3 font-display drop-shadow-md">Thủ Công Độc Bản</h3>
                                <p className="text-white/80 text-[14px] leading-[1.7] font-light">
                                    Vuốt tay 100%. Những vệt xước hay giọt men chảy chính là chữ ký của tự nhiên.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative h-[450px] lg:h-[550px] rounded-[40px] overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=800&auto=format&fit=crop" 
                                alt="Sống Bền Vững" 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-left text-white">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/30">
                                    <FiGlobe size={24} />
                                </div>
                                <h3 className="text-[28px] text-white mb-3 font-display drop-shadow-md">Sống Bền Vững</h3>
                                <p className="text-white/80 text-[14px] leading-[1.7] font-light">
                                    Tối giản rác thải nhựa đóng gói. Đồng hành cùng các nghệ nhân duy trì làng nghề truyền thống.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GALLERY SECTION */}
            <div className="py-20 md:py-24 px-2 md:px-5">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-4 md:px-8">
                        <div>
                            <h2 className="text-[32px] md:text-[40px] text-[#1a1a1a] mb-2 font-display">Góc Xưởng Gốm</h2>
                            <p className="text-[#888] text-[15px]">Những khoảnh khắc đời thường phía sau mỗi tác phẩm.</p>
                        </div>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-[14px] text-[#b5624a] font-medium hover:text-[#1a1a1a] transition-colors">
                            <FiInstagram size={18} /> @gomnau.workshop
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        <div className="aspect-square overflow-hidden rounded-xl md:rounded-3xl">
                            <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Gallery 1" />
                        </div>
                        <div className="aspect-square overflow-hidden rounded-xl md:rounded-3xl md:mt-8">
                            <img src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Gallery 2" />
                        </div>
                        <div className="aspect-square overflow-hidden rounded-xl md:rounded-3xl">
                            <img src="https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Gallery 3" />
                        </div>
                        <div className="aspect-square overflow-hidden rounded-xl md:rounded-3xl md:mt-8">
                            <img src="https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Gallery 4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* YOUTHFUL CTA */}
            <div className="py-24 px-5 relative overflow-hidden bg-[#faf7f4]">
                <div className="absolute inset-0 bg-[#1a1a1a]"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#b5624a] rounded-full mix-blend-screen opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#df6124] rounded-full mix-blend-screen opacity-20 blur-3xl"></div>
                
                <div className="relative z-10 text-center max-w-[800px] mx-auto text-white">
                    <h2 className="text-[36px] md:text-[56px] font-display mb-8 leading-[1.1]">
                        Bạn đã sẵn sàng mang nghệ thuật về nhà?
                    </h2>
                    <p className="text-[16px] md:text-[18px] opacity-80 font-light mb-10 max-w-[500px] mx-auto">
                        Cùng Gốm Nâu biến không gian sống của bạn trở thành một bảo tàng thu nhỏ của sự bình yên.
                    </p>
                    <Link 
                        to="/shop" 
                        className="inline-block px-10 py-4 bg-white text-[#1a1a1a] rounded-full text-[15px] font-medium 
                                 hover:bg-[#f5ebe0] transition-colors duration-300 shadow-xl"
                    >
                        Tới Cửa Hàng Ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}
