import mysql from 'mysql2/promise';

async function seed() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'devuser',
        password: 'user',
        database: 'ceramic_shop',
        port: 3306
    });

    const content = `<p class="drop-cap">Làng gốm Bàu Trúc nằm ở ven biển miền Trung là một trong những làng gốm cổ xưa nhất Đông Nam Á. Điều đặc biệt ở đây là các nghệ nhân không sử dụng bàn xoay, mà hoàn toàn dùng tay để vuốt và tạo hình cho gốm.</p>
<h2>Chất đất đặc biệt tạo nên linh hồn</h2>
<p>Đất sét được lấy từ sông Quao, mang đặc tính dẻo, mịn và chịu nhiệt cực tốt. Khi nung, gốm không cần tráng men mà tự lên màu đỏ gạch, nâu đen hoặc vệt khói tự nhiên rất đặc trưng.</p>
<blockquote>
    <p>"Gốm Bàu Trúc không có hai sản phẩm nào giống nhau y hệt. Mỗi chiếc bình, chiếc vại đều mang dấu ấn của ngọn lửa và nhịp thở của người thợ vuốt gốm."</p>
    <cite>— Nghệ nhân Đàng Xem</cite>
</blockquote>
<p>Sản phẩm sau khi phơi khô sẽ được chất thành đống ngoài bãi đất trống. Người thợ phủ rơm, củi và trấu lên trên rồi đốt. Nhiệt độ và hướng gió sẽ quyết định màu sắc cuối cùng của từng mẻ gốm.</p>`;

    const articles = [
        { Title: "Nghệ Thuật Gốm Sứ Truyền Thống", Slug: "nghe-thuat-gom-su-truyen-thong", MetaDescription: "Khám phá vẻ đẹp tiềm ẩn qua từng đường nét thủ công của các nghệ nhân làng gốm với kỹ thuật vuốt tay đỉnh cao.", ContentHtml: content, ThumbnailUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop", CreatedAt: new Date(Date.now() - 10 * 86400000), IsPublished: true },
        { Title: "Cách Bảo Quản Gốm Sứ Trong Nhà", Slug: "cach-bao-quan-gom-su", MetaDescription: "Những mẹo nhỏ giúp các món đồ gốm sứ yêu thích của bạn luôn giữ được vẻ sáng bóng như mới sau nhiều năm sử dụng.", ContentHtml: content, ThumbnailUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop", CreatedAt: new Date(Date.now() - 15 * 86400000), IsPublished: true },
        { Title: "Xu Hướng Trang Trí Nội Thất Cùng Gốm Mộc", Slug: "xu-huong-trang-tri-noi-that", MetaDescription: "Phong cách tối giản đang lên ngôi, và gốm mộc chính là điểm nhấn hoàn hảo cho không gian sống hiện đại.", ContentHtml: content, ThumbnailUrl: "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?q=80&w=800&auto=format&fit=crop", CreatedAt: new Date(Date.now() - 20 * 86400000), IsPublished: true },
        { Title: "Câu Chuyện Đằng Sau \"Gốm Nâu\"", Slug: "cau-chuyen-gom-nau", MetaDescription: "Từ một xưởng gốm nhỏ ven sông, Gốm Nâu đã trải qua bao thăng trầm để mang những sản phẩm tinh túy nhất đến tay bạn.", ContentHtml: content, ThumbnailUrl: "https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=800&auto=format&fit=crop", CreatedAt: new Date(Date.now() - 30 * 86400000), IsPublished: true },
        { Title: "Ra Mắt Bộ Sưu Tập Mùa Thu 2023", Slug: "bo-suu-tap-mua-thu", MetaDescription: "Những gam màu ấm áp của mùa thu được thổi hồn vào từng tác phẩm gốm mộc mạc mới nhất của chúng tôi.", ContentHtml: content, ThumbnailUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop", CreatedAt: new Date(Date.now() - 45 * 86400000), IsPublished: true },
        { Title: "Ý Nghĩa Của Đồ Gốm Trong Bữa Ăn Việt", Slug: "y-nghia-cua-gom-trong-doi-song", MetaDescription: "Bữa cơm gia đình thêm phần đầm ấm khi sử dụng bát đĩa gốm mộc mạc, lưu giữ hương vị tinh hoa truyền thống.", ContentHtml: content, ThumbnailUrl: "https://images.unsplash.com/photo-1590403759392-802c617b4458?q=80&w=800&auto=format&fit=crop", CreatedAt: new Date(Date.now() - 55 * 86400000), IsPublished: true }
    ];

    for (const a of articles) {
        await connection.execute(
            'INSERT INTO Articles (Title, Slug, MetaDescription, ContentHtml, ThumbnailUrl, CreatedAt, UpdatedAt, IsPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [a.Title, a.Slug, a.MetaDescription, a.ContentHtml, a.ThumbnailUrl, a.CreatedAt, a.CreatedAt, a.IsPublished ? 1 : 0]
        );
    }

    console.log("Seeded successfully");
    await connection.end();
}

seed().catch(console.error);
