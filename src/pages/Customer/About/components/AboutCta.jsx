import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutCta({ cta }) {
    return (
        <div className="about-cta">
            <div className="about-cta-bg"></div>
            <div className="about-cta-glow-1"></div>
            <div className="about-cta-glow-2"></div>
            
            <div className="about-cta-content">
                <h2 
                    className="about-cta-title" 
                    dangerouslySetInnerHTML={{ __html: cta.title?.replace(/\n/g, '<br/>') }}
                ></h2>
                <p className="about-cta-desc">{cta.description}</p>
                <Link to={cta.buttonLink} className="about-cta-btn">
                    {cta.buttonText}
                </Link>
            </div>
        </div>
    );
}
