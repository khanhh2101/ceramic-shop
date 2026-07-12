import React from 'react';
import { FiTarget, FiHeart, FiGlobe } from 'react-icons/fi';

export default function AboutValues({ values }) {
    const renderIcon = (iconName) => {
        switch (iconName?.toLowerCase()) {
            case 'heart': return <FiHeart size={24} />;
            case 'globe': return <FiGlobe size={24} />;
            case 'target': return <FiTarget size={24} />;
            default: return <FiTarget size={24} />;
        }
    };

    return (
        <div className="about-values">
            <div className="about-values-container">
                <div className="about-values-header">
                    <h2 className="about-values-title">{values.title}</h2>
                    <p className="about-values-desc">{values.description}</p>
                </div>

                <div className="about-values-grid">
                    {values.values?.map((val, idx) => (
                        <div key={idx} className={`about-value-card ${idx === 1 ? 'offset' : ''}`}>
                            <img src={val.image} alt={val.title} className="about-value-img" />
                            <div className={`about-value-overlay ${idx === 1 ? 'alt' : ''}`}></div>
                            <div className="about-value-content">
                                <div className="about-value-icon">
                                    {renderIcon(val.icon)}
                                </div>
                                <h3 className="about-value-title">{val.title}</h3>
                                <p className="about-value-desc">{val.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
