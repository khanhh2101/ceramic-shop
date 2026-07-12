import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function AuthLayout({ 
    children, 
    imageSrc, 
    quote, 
    quoteSub, 
    reverse = false,
    backLink = "/",
    backText = "Trang chủ"
}) {
    return (
        <div className={`flex min-h-screen bg-white ${reverse ? 'flex-row-reverse' : ''}`}>
            {/* IMAGE SIDE */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#faf7f4]">
                <img 
                    src={imageSrc} 
                    alt="Ceramic art"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-[36px] font-display mb-4 leading-[1.2]">
                        {quote}
                    </h2>
                    <p className="text-[15px] font-light opacity-90 max-w-[400px]">
                        {quoteSub}
                    </p>
                </div>
            </div>

            {/* FORM SIDE */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-32 py-12">
                <Link to={backLink} className="inline-flex items-center gap-2 text-[#555] hover:text-[#1a1a1a] mb-12 self-start transition-colors">
                    <FiArrowLeft /> <span className="text-[13px] uppercase tracking-[1px]">{backText}</span>
                </Link>

                <div className="w-full max-w-[440px] mx-auto lg:mx-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
