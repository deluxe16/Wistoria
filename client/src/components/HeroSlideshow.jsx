import React, { useState, useEffect, useCallback } from 'react';

const SLIDE_DURATION = 3000; // 3 seconds per slide

export default function HeroSlideshow({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = slides?.length || 0;

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  }, [slideCount]);

  // Auto-advance slideshow with timer, paused on user hover
  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slideCount, isPaused, nextSlide]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="hero-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Wistoria Campaign Slideshow"
    >
      <div className="slides-track">
        {slides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className={`slide-item ${index === currentIndex ? 'active' : ''}`}
            aria-hidden={index !== currentIndex}
          >
            <div className="slide-image-box">
              <img 
                src={slide.image} 
                alt={slide.caption || `Wistoria Haute Couture Look ${index + 1}`} 
                className="slide-img"
                style={{
                  objectPosition: slide.objectPosition || 'center 25%'
                }}
              />
              <div className="hero-overlay-shadow"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 06: Left Arrow */}
      <button 
        type="button"
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
        type="button"
        className="slide-arrow-btn right" 
        onClick={nextSlide}
        aria-label="Next Slide"
        id="btn-slide-next"
      >
        <svg className="arrow-chevron-svg" viewBox="0 0 24 24">
          <path d="M9 5L16 12L9 19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

    </div>
  );
}

