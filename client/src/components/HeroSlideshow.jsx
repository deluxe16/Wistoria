import React, { useState, useEffect, useRef } from 'react';

export default function HeroSlideshow({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  // Touch swipe support (06: allow swipe on mobile)
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="hero-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Wistoria Campaign Slideshow"
    >
      <div className="slides-track">
        {slides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className={`slide-item ${index === currentIndex ? 'active' : ''}`}
          >
            <div className="slide-image-box">
              <img 
                src={slide.image} 
                alt={slide.caption || "Wistoria Haute Couture Campaign"} 
                className="slide-img"
              />
              <div className="hero-overlay-shadow"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 06: Left Arrow */}
      <button 
        className="slide-arrow-btn left" 
        onClick={prevSlide}
        aria-label="Previous Slide"
        id="btn-slide-prev"
      >
        <svg className="arrow-chevron-svg" viewBox="0 0 24 24">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 06: Right Arrow */}
      <button 
        className="slide-arrow-btn right" 
        onClick={nextSlide}
        aria-label="Next Slide"
        id="btn-slide-next"
      >
        <svg className="arrow-chevron-svg" viewBox="0 0 24 24">
          <path d="M9 5L16 12L9 19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Pagination indicators */}
      <div className="slide-dots-container">
        {slides.map((_, i) => (
          <span 
            key={i} 
            className={`slide-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
