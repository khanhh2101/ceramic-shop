import React from 'react';

export default function BlogHero({ title, description, bgImage }) {
    return (
        <header className="blog-hero">
            <div className="blog-hero-bg">
                <img 
                    src={bgImage || "https://images.unsplash.com/photo-1565193566173-6a0d0d860d5b?q=80&w=2000&auto=format&fit=crop"} 
                    alt={title}
                    className="blog-hero-img"
                />
                <div className="blog-hero-overlay"></div>
            </div>
            <div className="blog-hero-content">
                <h1 className="blog-hero-title">
                    {title}
                </h1>
                <p className="blog-hero-desc">
                    {description}
                </p>
            </div>
        </header>
    );
}
