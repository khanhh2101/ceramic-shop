import { useNavigate } from 'react-router-dom';

export default function PromoBanner({ promoData }) {
    const navigate = useNavigate();

    return (
        <div className="bg-[#e6ddcf] text-[#1a1a1a]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-[400px] lg:h-[600px] overflow-hidden group">
                    <img 
                        src={promoData.image || "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=1200&auto=format&fit=crop"} 
                        alt="Khuyến mãi" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" 
                    />
                </div>
                {/* Content */}
                <div className="flex flex-col justify-center p-12 lg:p-24 relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white rounded-full blur-[100px] opacity-40"></div>
                    <span className="text-[#b5624a] text-[12px] font-bold uppercase tracking-[4px] mb-4 relative z-10">
                        {promoData.tag || 'Ưu Đãi Đặc Biệt'}
                    </span>
                    <h2 
                        className="text-[42px] md:text-[56px] font-display leading-[1.1] mb-6 relative z-10 text-[#1a1a1a]" 
                        dangerouslySetInnerHTML={{ __html: promoData.title?.replace('\n', '<br/>') || 'Khơi Nguồn <br/> <span className="italic text-[#8a3e2a]">Sự Tĩnh Lặng</span>' }}
                    ></h2>
                    <p className="text-[#555] text-[16px] leading-[1.8] mb-10 max-w-md font-light relative z-10">
                        {promoData.description || 'Giảm đến 40% cho toàn bộ sưu tập chậu trồng cây và đồ trang trí. Mang thiên nhiên vào nhà với phong cách tối giản mộc mạc nhất.'}
                    </p>
                    <button 
                        className="bg-[#1a1a1a] hover:bg-[#b5624a] text-white py-4 px-10 text-[13px] font-bold uppercase tracking-[2px] rounded-full transition-all duration-300 w-fit relative z-10"
                        onClick={() => navigate(promoData.buttonLink || '/shop')}
                    >
                        {promoData.buttonText || 'Khám phá ưu đãi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
