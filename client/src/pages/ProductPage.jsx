import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { SHOP_PRODUCTS } from '../data/shopProducts';

const CURRENT_YEAR = 2026;

export default function ProductPage({
  productId,
  onOpenMenu,
  onOpenSearch,
  onOpenBag,
  cartCount = 0,
  onAddToCart,
  onNavigateShop,
  onNavigateHome
}) {
  // Find current product or default to first product
  const product = SHOP_PRODUCTS.find((p) => p.id === productId) || SHOP_PRODUCTS[0];

  // Gallery state
  const galleryImages = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Size selection state (Reference 04A, 04B, 04C: null -> 'SELECT SIZE', chosen -> 'ADD TO BAG')
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeErrorShake, setSizeErrorShake] = useState(false);

  // Description expansion state (Reference 04B, 04C: More -> Less)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Accordions state (Reference 04D: Fit & Size, Care, Delivery & Returns)
  const [openAccordions, setOpenAccordions] = useState({
    fit: false,
    care: false,
    delivery: false
  });

  // Size Guide modal state (Reference 04A: Size Guide)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Adding feedback state
  const [isAdding, setIsAdding] = useState(false);

  // Touch & Mouse swipe support for gallery (Reference 04A Annotation 02)
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const isMouseDownRef = useRef(false);
  const [swipeDeltaX, setSwipeDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Scroll to top when product mounts or changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Keyboard navigation for desktop gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryImages.length]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
    setSwipeDeltaX(0);
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
    const delta = touchEndXRef.current - touchStartXRef.current;
    // Clamp visual feedback to ±80px
    setSwipeDeltaX(Math.max(-80, Math.min(80, delta)));
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    setIsSwiping(false);
    setSwipeDeltaX(0);
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swipe left -> next image
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
      } else {
        // Swipe right -> prev image
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    }
  };

  const handleMouseDown = (e) => {
    isMouseDownRef.current = true;
    touchStartXRef.current = e.clientX;
    touchEndXRef.current = e.clientX;
    setIsSwiping(true);
    setSwipeDeltaX(0);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    touchEndXRef.current = e.clientX;
    const delta = touchEndXRef.current - touchStartXRef.current;
    setSwipeDeltaX(Math.max(-80, Math.min(80, delta)));
  };

  const handleMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    const diff = touchStartXRef.current - touchEndXRef.current;
    setIsSwiping(false);
    setSwipeDeltaX(0);
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
      } else {
        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    }
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePurchaseClick = () => {
    if (!selectedSize) {
      // Prompt user to select size
      setSizeErrorShake(true);
      setTimeout(() => setSizeErrorShake(false), 800);
      return;
    }

    setIsAdding(true);
    onAddToCart?.({
      ...product,
      size: selectedSize
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const sizes = product.sizes || ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="product-page-wrapper">
      {/* 01: BRAND HEADER (Reference 04A - Annotation 01) */}
      <Header
        onOpenMenu={onOpenMenu}
        onOpenSearch={onOpenSearch}
        onOpenBag={onOpenBag}
        cartCount={cartCount}
        theme="light"
        onLogoClick={onNavigateHome}
      />

      {/* Navigation Breadcrumb / Back to Shop */}
      <div className="product-breadcrumb-bar">
        <button 
          className="product-back-btn"
          onClick={() => {
            if (onNavigateShop) {
              onNavigateShop();
            } else {
              window.location.hash = '#shop';
            }
          }}
          aria-label="Back to Shop"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>BACK TO SHOP</span>
        </button>
      </div>

      <main className="product-main-container">
        {/* ============================================================ */}
        {/* LEFT COLUMN: PRODUCT GALLERY (Reference 04A - Annotation 02) */}
        {/* ============================================================ */}
        <section className="product-gallery-section" aria-label="Product Photographs">
          <div 
            className="product-gallery-slider"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isMouseDownRef.current) {
                isMouseDownRef.current = false;
                setIsSwiping(false);
                setSwipeDeltaX(0);
              }
            }}
            style={{
              cursor: galleryImages.length > 1 ? (isSwiping ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {/* Main Active Slide */}
            <div className="product-slide-frame">
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${product.name} - photograph ${activeImageIndex + 1}`}
                className="product-main-image"
                loading="eager"
                style={{
                  transform: isSwiping && swipeDeltaX !== 0 
                    ? `translateX(${swipeDeltaX * 0.15}px)` 
                    : undefined,
                  transition: isSwiping ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              {/* Gallery Controls (Chevrons) */}
              {galleryImages.length > 1 && (
                <>
                  <button 
                    type="button" 
                    className="gallery-nav-arrow gallery-prev" 
                    onClick={handlePrevImage}
                    aria-label="Previous photograph"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="gallery-nav-arrow gallery-next" 
                    onClick={handleNextImage}
                    aria-label="Next photograph"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail preview strip (desktop) */}
            {galleryImages.length > 1 && (
              <div className="product-thumbnails-row">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`product-thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photograph ${idx + 1}`}
                  >
                    <img src={imgUrl} alt="" className="product-thumb-img" />
                  </button>
                ))}
              </div>
            )}

            {/* Dot indicators (mobile only — swipe to navigate) */}
            {galleryImages.length > 1 && (
              <div className="product-gallery-dots" aria-hidden="true">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`product-gallery-dot ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photograph ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: PRODUCT DETAILS (Reference 04A, 04B, 04C, 04D) */}
        {/* ============================================================ */}
        <section className="product-details-section">
          {/* 03: PRODUCT & 04: SIZE GUIDE (Reference 04A) */}
          <div className="product-header-row">
            <div className="product-title-group">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">{product.priceFormatted || `$${product.price}`}</p>
            </div>

            <button 
              type="button" 
              className="product-size-guide-btn" 
              onClick={() => setIsSizeGuideOpen(true)}
              aria-label="Open size guide"
            >
              Size Guide
            </button>
          </div>

          {/* 01: SIZE SELECTION GRID (Reference 04A, 04B, 04C) */}
          <div className={`product-sizes-block ${sizeErrorShake ? 'shake' : ''}`}>
            <div className="product-sizes-grid">
              {sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    className={`product-size-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={isSelected}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {sizeErrorShake && (
              <p className="size-hint-text">Please choose a size to continue</p>
            )}
          </div>

          {/* 02: PURCHASE BUTTON (Reference 04B & 04C) */}
          <div className="product-purchase-block">
            <button
              type="button"
              className={`product-action-btn ${selectedSize ? 'can-add' : 'select-size'} ${isAdding ? 'adding' : ''}`}
              onClick={handlePurchaseClick}
              aria-label={selectedSize ? `Add ${product.name} to shopping bag` : "Select size first"}
            >
              {isAdding ? 'ADDING TO BAG...' : selectedSize ? 'ADD TO BAG' : 'SELECT SIZE'}
            </button>
          </div>

          {/* 03: DESCRIPTION / MORE & LESS (Reference 04B, 04C, 04D) */}
          <div className="product-description-block">
            {!isDescriptionExpanded ? (
              // Collapsed short description (Reference 04B & 04D)
              <div className="description-short-view">
                <p className="description-text">
                  {product.shortDescription || "An ivory halter top with draped detailing and long fringe..."}
                </p>
                <button
                  type="button"
                  className="description-toggle-link"
                  onClick={() => setIsDescriptionExpanded(true)}
                  aria-expanded="false"
                >
                  More
                </button>
              </div>
            ) : (
              // Expanded description with bulleted facts (Reference 04C)
              <div className="description-expanded-view">
                <p className="description-text">
                  {product.fullDescription || "An ivory halter top with draped detailing and long fringe. Full product description to be supplied."}
                </p>
                
                {product.facts && product.facts.length > 0 && (
                  <ul className="product-facts-list">
                    {product.facts.map((fact, idx) => (
                      <li key={idx} className="product-fact-item">
                        {fact}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  className="description-toggle-link"
                  onClick={() => setIsDescriptionExpanded(false)}
                  aria-expanded="true"
                >
                  Less
                </button>
              </div>
            )}
          </div>

          {/* 02: ACCORDIONS (Reference 04D - Annotation 02) */}
          <div className="product-accordions-group">
            {/* Fit & Size Accordion */}
            <div className="accordion-item">
              <button
                type="button"
                className={`accordion-header ${openAccordions.fit ? 'open' : ''}`}
                onClick={() => toggleAccordion('fit')}
                aria-expanded={openAccordions.fit}
              >
                <span className="accordion-title">Fit & Size</span>
                <svg 
                  className={`accordion-chevron ${openAccordions.fit ? 'rotated' : ''}`} 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openAccordions.fit && (
                <div className="accordion-content">
                  <p>{product.accordions?.fit || "Cut for a fluid, draped fit. True to standard French sizing. Model is 178cm / 5'10\" and wears size S."}</p>
                </div>
              )}
            </div>

            {/* Care Accordion */}
            <div className="accordion-item">
              <button
                type="button"
                className={`accordion-header ${openAccordions.care ? 'open' : ''}`}
                onClick={() => toggleAccordion('care')}
                aria-expanded={openAccordions.care}
              >
                <span className="accordion-title">Care</span>
                <svg 
                  className={`accordion-chevron ${openAccordions.care ? 'rotated' : ''}`} 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openAccordions.care && (
                <div className="accordion-content">
                  <p>{product.accordions?.care || "100% Fluid Silk Satin / Artisanal Hand-Knotted Fringe. Specialist dry clean only. Store hanging in a protective garment bag to maintain fringe silhouette."}</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns Accordion */}
            <div className="accordion-item">
              <button
                type="button"
                className={`accordion-header ${openAccordions.delivery ? 'open' : ''}`}
                onClick={() => toggleAccordion('delivery')}
                aria-expanded={openAccordions.delivery}
              >
                <span className="accordion-title">Delivery & Returns</span>
                <svg 
                  className={`accordion-chevron ${openAccordions.delivery ? 'rotated' : ''}`} 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openAccordions.delivery && (
                <div className="accordion-content">
                  <p>{product.accordions?.delivery || "Complimentary express courier shipping on orders over $300. Delivered in signature Maison Wistoria archival packaging with garment sleeve. Returns accepted within 14 days in unworn condition."}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Luxury Maison Wistoria Footer */}
      <footer className="shop-page-footer">
        <div className="shop-footer-inner">
          <div className="shop-footer-brand">
            <span className="footer-brand-title">MAISON WISTORIA</span>
            <p className="footer-brand-tagline">Haute Couture & Ready-to-Wear</p>
          </div>
          <div className="shop-footer-links">
            <a href="#shop" onClick={onNavigateShop}>SHOP</a>
            <a href="#campaign" onClick={onNavigateHome}>CAMPAIGN</a>
            <a href="#contact">CONTACT</a>
            <a href="#terms">TERMS</a>
          </div>
          <div className="shop-footer-copy">
            <p>© {CURRENT_YEAR} WISTORIA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* SIZE GUIDE MODAL                                             */}
      {/* ============================================================ */}
      {isSizeGuideOpen && (
        <>
          <div 
            className="size-guide-backdrop" 
            onClick={() => setIsSizeGuideOpen(false)} 
            aria-hidden="true" 
          />
          <div className="size-guide-modal" role="dialog" aria-label="Size Guide">
            <div className="size-guide-header">
              <h2 className="size-guide-title">MAISON WISTORIA — SIZE GUIDE</h2>
              <button 
                type="button" 
                className="size-guide-close-btn" 
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Close size guide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>

            <div className="size-guide-body">
              <p className="size-guide-intro">
                All garments are meticulously tailored according to French haute couture sizing standards.
              </p>

              <div className="size-table-scroll">
                <table className="size-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>FR</th>
                      <th>US</th>
                      <th>UK</th>
                      <th>Bust (in)</th>
                      <th>Waist (in)</th>
                      <th>Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>XXS</td><td>32</td><td>0</td><td>4</td><td>30 - 31</td><td>23 - 24</td><td>33 - 34</td></tr>
                    <tr><td>XS</td><td>34</td><td>2</td><td>6</td><td>31 - 32</td><td>24 - 25</td><td>34 - 35</td></tr>
                    <tr><td>S</td><td>36</td><td>4</td><td>8</td><td>33 - 34</td><td>26 - 27</td><td>36 - 37</td></tr>
                    <tr><td>M</td><td>38</td><td>6</td><td>10</td><td>35 - 36</td><td>28 - 29</td><td>38 - 39</td></tr>
                    <tr><td>L</td><td>40</td><td>8</td><td>12</td><td>37 - 38</td><td>30 - 31</td><td>40 - 41</td></tr>
                    <tr><td>XL</td><td>42</td><td>10</td><td>14</td><td>39 - 40</td><td>32 - 33</td><td>42 - 43</td></tr>
                    <tr><td>XXL</td><td>44</td><td>12</td><td>16</td><td>41 - 43</td><td>34 - 36</td><td>44 - 46</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
