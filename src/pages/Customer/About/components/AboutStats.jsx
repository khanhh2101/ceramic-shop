import React from 'react';

export default function AboutStats({ stats }) {
    return (
        <div className="about-stats">
            <div className="about-stats-container">
                <div className="about-stats-grid">
                    {stats.map((item, idx) => (
                        <div key={idx} className="about-stats-item">
                            <div className="about-stats-number">{item.number}</div>
                            <div className="about-stats-label">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
