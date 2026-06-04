import './AboutStyle.css';

function About() {
    const qualities = [
        {
            title: 'Bền Vững',
            image: '/assets/image/about/quality1.png',
            description:
                'Sản phẩm được chế tác từ gốm Chăm Bàu Trúc với độ bền cao và tính thẩm mỹ vượt thời gian.',
        },
        {
            title: 'Độc đáo',
            image: '/assets/image/about/quality2.png',
            description:
                'Mỗi sản phẩm đều mang dấu ấn riêng của nghệ nhân, không có hai sản phẩm hoàn toàn giống nhau.',
        },
        {
            title: 'Dễ sử dụng',
            image: '/assets/image/about/quality3.png',
            description:
                'Quy trình sản xuất thân thiện với môi trường và gìn giữ giá trị văn hóa truyền thống.',
        },
    ];

    return (
        <div className="page" id="page-about">
            {/* ── HERO ── */}
            <div className="about-hero">
                <img
                    className="about-hero-bg"
                    src="/assets/image/about/about-hero.jpg"
                    alt="about-background"
                />
                <div className="about-hero-overlay" />

                <div className="about-hero-content">
                    <h1 className="about-hero__title">Về Chúng tôi</h1>
                    <p className="about-hero-description">Gốm Nâu...</p>
                </div>
            </div>
            <div className="about-header">
                <div className="about-header-image">
                    <img src="./assets/image/about/about.jpg" alt="ceramic" />
                </div>
                <div className="about-header-content">
                    <h2> Nhà cung cấp gốm mỹ nghệ và gốm gia dụng</h2>
                    <p className="about-description">
                        Gốm Chăm Bàu Trúc được chế tác từ năm ...
                    </p>
                </div>
            </div>
            <div className="quality">
                <div className="quality-content">
                    <h2 className="quality-header">Nghệ thuật & Giá trị</h2>
                    {qualities.map((item, index) => (
                        <div
                            key={index}
                            className={`quality-row ${
                                index % 2 !== 0 ? 'reverse' : ''
                            }`}
                        >
                            <div className="quality-text-box">
                                <div className="quality-text">
                                    <h3>{item.title}</h3>

                                    <p>{item.description}</p>
                                </div>
                            </div>

                            <div className="quality-image-box">
                                <img src={item.image} alt={item.title} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;
