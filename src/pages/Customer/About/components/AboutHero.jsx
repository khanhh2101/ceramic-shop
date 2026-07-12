import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function AboutHero({ hero }) {
    return (
        <div className="about-hero">
            <div className="about-hero-bg">
                <img src={hero.image} alt={hero.title} />
                <div className="about-hero-overlay"></div>
            </div>
            
            <div className="about-hero-content">
                <div className="about-hero-badge">
                    {hero.subtitle}
                </div>
                <h1 
                    className="about-hero-title" 
                    dangerouslySetInnerHTML={{ __html: hero.title?.replace(/\n/g, '<br/>') }}
                ></h1>
                <p className="about-hero-desc">
                    {hero.description}
                </p>
                <Link to={hero.buttonLink} className="about-hero-btn">
                    {hero.buttonText} <FiArrowRight />
                </Link>
            </div>
        </div>
    );
}
