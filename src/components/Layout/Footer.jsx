import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useSiteSettings } from '../../hooks/useSiteSettings';

// ── Footer Component ──────────────────────────────────────────────────────────
export default function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 mt-auto">
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Cột 1: Thương hiệu ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">G</span>
              </div>
              <span className="font-display font-bold text-xl text-white">{settings.store_name || 'Gốm Nâu'}</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              {settings.footer_about || 'Gốm sứ thủ công cao cấp, mang vẻ đẹp tự nhiên vào không gian sống của bạn.'}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <FiFacebook />, href: settings.social_facebook || '#', label: 'Facebook' },
                { icon: <FiInstagram />, href: settings.social_instagram || '#', label: 'Instagram' },
                { icon: <FiYoutube />, href: settings.social_youtube || '#', label: 'YouTube' },
              ].map((s) => s.href && s.href !== '#' && (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center
                             text-gray-400 hover:bg-primary-600 hover:text-white
                             transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Cột 2: Liên kết nhanh ── */}
          <div>
            <h3 className="text-white font-semibold mb-5">Khám phá</h3>
            <ul className="space-y-3">
              {[
                { to: '/shop', label: 'Cửa hàng' },
                { to: '/blog', label: 'Blog' },
                { to: '/about', label: 'Về chúng tôi' },
                { to: '/contact', label: 'Liên hệ' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm hover:text-primary-400 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Cột 3: Chính sách ── */}
          <div>
            <h3 className="text-white font-semibold mb-5">Chính sách</h3>
            <ul className="space-y-3">
              {[
                { to: '/policy/shipping', label: 'Chính sách vận chuyển' },
                { to: '/policy/return', label: 'Chính sách đổi trả' },
                { to: '/policy/privacy', label: 'Bảo mật thông tin' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm hover:text-primary-400 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Cột 4: Liên hệ ── */}
          <div>
            <h3 className="text-white font-semibold mb-5">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <FiMapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                {settings.store_address || '123 Đường Gốm, Quận 1, TP.HCM'}
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FiPhone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href={`tel:${settings.store_phone || '0901234567'}`} className="hover:text-primary-400 transition-colors">
                  {settings.store_phone || '0901 234 567'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FiMail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href={`mailto:${settings.store_email || 'hello@ceramicshop.vn'}`} className="hover:text-primary-400 transition-colors">
                  {settings.store_email || 'hello@ceramicshop.vn'}
                </a>
              </li>
            </ul>

            {/* Payment icons */}
            <div className="mt-6">
              <p className="text-xs mb-3 text-gray-500">Chấp nhận thanh toán</p>
              <div className="flex items-center gap-2">
                {['COD', 'MoMo', 'VNPay'].map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-md bg-gray-800 text-xs text-gray-300 font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center
                       justify-between gap-4">
          <p className="text-xs text-gray-600">
            {settings.footer_copyright || `© ${year} Gốm Nâu. All rights reserved.`}
          </p>
          <p className="text-xs text-gray-600">
            Thiết kế với ❤️ bởi đội ngũ Gốm Nâu
          </p>
        </div>
      </div>
    </footer>
  );
}
