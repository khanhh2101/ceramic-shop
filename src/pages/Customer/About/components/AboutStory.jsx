import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function AboutStory({ story }) {
    return (
        <div className="about-story">
            <div className="about-story-container">
                <div className="about-story-grid">
                    <div className="about-story-images">
                        <div className="about-story-shape-1"></div>
                        <div className="about-story-shape-2"></div>
                        
                        <div className="about-story-carousel">
                            {story.images.length > 1 ? (
                                <Swiper
                                    modules={[EffectFade, Autoplay]}
                                    effect="fade"
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    loop={true}
                                    allowTouchMove={false}
                                    className="w-full h-full"
                                >
                                    {story.images.map((img, idx) => {
                                        const imgSrc = typeof img === 'string' ? img : img.image;
                                        const imgLink = typeof img === 'string' ? '' : (img.link || '');
                                        const ImageElement = <img src={imgSrc} alt="Story" className="w-full h-full object-cover" />;
                                        return (
                                        <SwiperSlide key={idx}>
                                            {imgLink ? (
                                                <Link to={imgLink} className="block w-full h-full">
                                                    {ImageElement}
                                                </Link>
                                            ) : (
                                                ImageElement
                                            )}
                                        </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            ) : (
                                (() => {
                                    const img = story.images[0];
                                    const imgSrc = typeof img === 'string' ? img : img.image;
                                    const imgLink = typeof img === 'string' ? '' : (img.link || '');
                                    const ImageElement = <img src={imgSrc} alt="Story" className="w-full h-full object-cover" />;
                                    return imgLink ? (
                                        <Link to={imgLink} className="block w-full h-full">
                                            {ImageElement}
                                        </Link>
                                    ) : (
                                        ImageElement
                                    );
                                })()
                            )}
                        </div>
                    </div>
                    
                    <div className="about-story-content">
                        <div className="about-story-tag">
                            <div className="about-story-tag-line"></div>
                            <span className="about-story-tag-text">{story.title || 'Hành Trình Gốm Nâu'}</span>
                        </div>
                        <h2 
                            className="about-story-title" 
                            dangerouslySetInnerHTML={{ __html: story.title?.replace(/\n/g, '<br/>') }}
                        ></h2>
                        <div 
                            className="about-story-text" 
                            dangerouslySetInnerHTML={{ __html: story.content?.replace(/\n/g, '<br/>') }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
