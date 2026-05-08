import './AboutStyle.css';
import aboutImg from '../../../public/assets/image/aboutimage/about.png';
import exclusiveImg from '../../../public/assets/image/aboutimage/exclusive.png';

function About() {
    const qualities = [
        {
            number: '01',
            text: 'Chất lượng',
            description:
                'Một trong những lý do lớn nhất để chọn cốc sứ hoặc gốm thủ công là độ bền vượt trội của chúng.',
        },
        {
            number: '02',
            text: 'Tính độc đáo',
            description:
                'Một trong những lý do lớn nhất để chọn cốc sứ hoặc gốm thủ công là độ bền vượt trội của chúng.',
        },
        {
            number: '03',
            text: 'Tính dễ sử dụng',
            description:
                'Một trong những lý do lớn nhất để chọn cốc sứ hoặc gốm thủ công là độ bền vượt trội của chúng.',
        },
        {
            number: '04',
            text: 'Sáng tạo',
            description:
                'Một trong những lý do lớn nhất để chọn cốc sứ hoặc gốm thủ công là độ bền vượt trội của chúng.',
        },
        {
            number: '05',
            text: 'Bền vững',
            description:
                'Một trong những lý do lớn nhất để chọn cốc sứ hoặc gốm thủ công là độ bền vượt trội của chúng.',
        },
        {
            number: '06',
            text: 'Đổi mới',
            description:
                'Một trong những lý do lớn nhất để chọn cốc sứ hoặc gốm thủ công là độ bền vượt trội của chúng.',
        },
    ];

    const exclusiveQualities = [
        {
            icon: '🏆',
            title: 'Tay nghề thủ công cao cấp',
            description:
                'Gốm của chúng tôi được chế tác với tình yêu và sự tỉ mỉ.',
        },
        {
            icon: '🌿',
            title: 'Thân thiện với môi trường & Bền vững',
            description:
                'Chúng tôi tạo ra những sản phẩm bền lâu với môi trường.',
        },
        {
            icon: '🎁',
            title: 'Hoàn hảo cho mọi dịp',
            description:
                'Phù hợp cho mọi dịp từ quà tặng đến sử dụng hàng ngày.',
        },
    ];
    return (
        <div className="page" id="page-about">
            {/* ── HERO ── */}
            <div className="about-hero">
                <p className="about-hero__subtitle">Welcome to Ceramic Shop</p>
                <h1 className="about-hero__title">About Us</h1>
            </div>
            <div className="about-header">
                <div className="about-image">
                    <img src={aboutImg} alt="ceramic" />
                </div>
                <div className="about-ceramic">
                    <p>Về Ceramic Shop</p>
                    <h2> Nhà cung cấp gốm mỹ nghệ và gốm gia dụng</h2>
                    <p class="about-description">
                        Gốm thủ công Việt Nam được chế tác từ năm 1650 — hãy
                        cùng khám phá hành trình của chúng tôi
                    </p>
                    <span>
                        <li>Hơn 1.200 mẫu gốm mỹ nghệ độc đáo </li>
                        <li> Hơn 1.200 mẫu gốm gia </li>
                        dụng
                    </span>
                </div>
            </div>
            <div className="qualities">
                <h2>Chất lượng & Giá trị</h2>
                <div className="qualities-content">
                    {qualities.map((item, index) => (
                        <div key={index} className="qualities-item">
                            <div className="qualities-text">
                                <div className="qualities-number">
                                    {item.number}
                                </div>
                                <h3>{item.text}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="exclusive">
                <div className="exclusive-content">
                    <h4 className="exclusive-subtitle">Cốc sứ cao cấp</h4>
                    <h2 className="exclusive-title">Những điểm độc đáo</h2>
                    <p className="exclusive-description">
                        Chất lượng tuyệt hảo, được chế tác để mang lại sự thư
                        giãn và sảng khoái.
                    </p>
                    <div className="Exclusive-list">
                        {exclusiveQualities.map((item, index) => (
                            <div key={index} className="exclusive-item">
                                <div className="exclusive-row">
                                    <div className="exclusive-icon">
                                        {item.icon}
                                    </div>
                                    <div className="exclusive-text">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-dark">Liên hệ</button>
                </div>
                <div className="exclusive-image">
                    <img src={exclusiveImg} alt="Exclusive Qualities" />
                </div>
            </div>
        </div>
    );
}

export default About;
