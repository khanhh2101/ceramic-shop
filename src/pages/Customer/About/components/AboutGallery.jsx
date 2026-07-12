import React from 'react';
import { FiInstagram } from 'react-icons/fi';

export default function AboutGallery({ gallery }) {
    return (
        <div className="about-gallery">
            <div className="about-gallery-container">
                <div className="about-gallery-header">
                    <div>
                        <h2 className="about-gallery-title">{gallery.title}</h2>
                        <p className="about-gallery-subtitle">{gallery.subtitle}</p>
                    </div>
                    {gallery.instagramLink && (
                        <a href={gallery.instagramLink} target="_blank" rel="noreferrer" className="about-gallery-link">
                            <FiInstagram size={18} /> {gallery.instagramText}
                        </a>
                    )}
                </div>
                
                <div className="about-gallery-grid">
                    {gallery.images?.map((img, idx) => (
                        <div key={idx} className={`about-gallery-item ${idx % 2 === 1 ? 'offset' : ''}`}>
                            <img src={img} alt={`Gallery ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
