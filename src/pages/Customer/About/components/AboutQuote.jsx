import React from 'react';

export default function AboutQuote({ quote }) {
    return (
        <div className="about-quote">
            <div className="about-quote-container">
                <svg className="about-quote-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <h3 className="about-quote-text" dangerouslySetInnerHTML={{ __html: quote.quote }}></h3>
                <p className="about-quote-author">— {quote.author} —</p>
            </div>
        </div>
    );
}
