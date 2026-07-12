import { useState, useEffect } from 'react';
import { aboutApi } from './api/aboutApi';

import AboutHero from './components/AboutHero';
import AboutStats from './components/AboutStats';
import AboutStory from './components/AboutStory';
import AboutQuote from './components/AboutQuote';
import AboutValues from './components/AboutValues';
import AboutGallery from './components/AboutGallery';
import AboutCta from './components/AboutCta';

import './AboutPage.css';

export default function AboutPage() {
    const [blocks, setBlocks] = useState({});

    useEffect(() => {
        aboutApi.getHomeSettings().then(res => {
            const data = res || [];
            const blockMap = {};
            data.forEach(b => {
                if (b.blockKey.startsWith('about_') || b.blockKey === 'brand_story') {
                    try {
                        blockMap[b.blockKey] = JSON.parse(b.dataJson);
                    } catch (e) {
                        blockMap[b.blockKey] = {};
                    }
                }
            });
            setBlocks(blockMap);
        }).catch(err => console.error(err));
    }, []);

    const hero = blocks['about_hero'] || {
        image: "https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop",
        subtitle: "Về Chúng Tôi",
        title: "Thổi Hồn \n Vào Đất Mẹ",
        description: "Chúng tôi tin rằng mỗi món đồ gốm đều mang trong mình một linh hồn, một câu chuyện được nặn thành hình từ đôi bàn tay nhẫn nại và tình yêu với tự nhiên.",
        buttonText: "Khám phá cửa hàng",
        buttonLink: "/shop"
    };

    const stats = blocks['about_stats']?.stats || [
        { number: "5+", label: "Năm Thành Lập" },
        { number: "20+", label: "Nghệ Nhân Mộc" },
        { number: "10k", label: "Sản Phẩm Bán Ra" },
        { number: "100%", label: "Làm Thủ Công" }
    ];

    const story = blocks['brand_story'] || {
        title: "Từ đất sét vô tri \n đến tổ ấm của bạn.",
        content: "Năm 2018, chúng tôi là những người trẻ đam mê nghệ thuật thị giác và phong cách sống tối giản. Đứng trước sự lên ngôi của đồ nhựa và đồ công nghiệp, Gốm Nâu ra đời như một nốt trầm tĩnh lặng.\nChúng tôi đi khắp các xưởng gốm lâu đời, làm việc cùng những nghệ nhân tâm huyết nhất. Mỗi sản phẩm tại Gốm Nâu là sự kết hợp giữa kỹ thuật thủ công truyền thống và hơi thở thiết kế đương đại: trẻ trung, thanh lịch và mang đậm tính ứng dụng.\n<span class=\"font-medium text-[#1a1a1a] italic border-l-4 border-[#c4a882] pl-4 inline-block mt-4\">\"Chúng tôi không bán đồ vật. Chúng tôi bán một phong cách sống bình yên.\"</span>",
        images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"]
    };
    
    if (story.image && (!story.images || story.images.length === 0)) {
        story.images = [story.image];
    }
    if (!story.images || story.images.length === 0) {
        story.images = ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"];
    }

    const quote = blocks['about_quote'] || {
        quote: "Vẻ đẹp thực sự không nằm ở sự hoàn hảo không tì vết, mà nằm ở những dấu ấn độc bản của tự nhiên và bàn tay con người.",
        author: "Founder Gốm Nâu"
    };

    const values = blocks['about_values'] || {
        title: "Giá Trị Cốt Lõi",
        description: "Ba viên gạch nền móng tạo nên triết lý hoạt động và mọi sản phẩm của Gốm Nâu.",
        values: [
            { image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop", title: "Chất Lượng Thật", description: "Đất sét tự nhiên, men gốm 100% không chứa chì. Đảm bảo an toàn sức khỏe tuyệt đối.", icon: "target" },
            { image: "https://images.unsplash.com/photo-1590403759392-802c617b4458?q=80&w=800&auto=format&fit=crop", title: "Thủ Công Độc Bản", description: "Vuốt tay 100%. Những vệt xước hay giọt men chảy chính là chữ ký của tự nhiên.", icon: "heart" },
            { image: "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=800&auto=format&fit=crop", title: "Sống Bền Vững", description: "Tối giản rác thải nhựa đóng gói. Đồng hành cùng các nghệ nhân duy trì làng nghề truyền thống.", icon: "globe" }
        ]
    };

    const gallery = blocks['about_gallery'] || {
        title: "Góc Xưởng Gốm",
        subtitle: "Những khoảnh khắc đời thường phía sau mỗi tác phẩm.",
        instagramLink: "https://instagram.com",
        instagramText: "@gomnau.workshop",
        images: [
            "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=600&auto=format&fit=crop"
        ]
    };

    const cta = blocks['about_cta'] || {
        title: "Bạn đã sẵn sàng mang nghệ thuật về nhà?",
        description: "Cùng Gốm Nâu biến không gian sống của bạn trở thành một bảo tàng thu nhỏ của sự bình yên.",
        buttonText: "Tới Cửa Hàng Ngay",
        buttonLink: "/shop"
    };

    return (
        <div className="about-page">
            <AboutHero hero={hero} />
            <AboutStats stats={stats} />
            <AboutStory story={story} />
            <AboutQuote quote={quote} />
            <AboutValues values={values} />
            <AboutGallery gallery={gallery} />
            <AboutCta cta={cta} />
        </div>
    );
}
