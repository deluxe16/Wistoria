import React, { useState } from 'react';
import Header from '../components/Header';
import { SHOP_PRODUCTS } from '../data/shopProducts';

const CURRENT_YEAR = 2026;

export default function ShopPage({
  onOpenMenu,
  onOpenSearch,
  onOpenBag,
  cartCount = 0,
  onAddToCart,
  onNavigateHome
}) {
  const [addingId, setAddingId] = useState(null);

  const handleAddClick = (e, product) => {
    e.preventDefault();
    setAddingId(product.id);
    onAddToCart?.(product);
    setTimeout(() => {
      setAddingId(null);
    }, 900);
  };

  return (
    <div className="shop-page-wrapper">
      {/* 01: BRAND HEADER (Reference 03B: Centred supplied logo; fine menu, search and bag icons) */}
      <Header
        onOpenMenu={onOpenMenu}
        onOpenSearch={onOpenSearch}
        onOpenBag={onOpenBag}
        cartCount={cartCount}
        theme="light"
        onLogoClick={onNavigateHome}
      />

      <main className="shop-main-content">
        {/* 02: COLLECTION INTRO (Small, light heading and centred introductory text) */}
        <section className="shop-intro-section" aria-labelledby="shop-intro-heading">
          <div className="shop-intro-container">
            <h1 id="shop-intro-heading" className="shop-intro-title">
              SHOP
            </h1>
            <p className="shop-intro-description">
              Designs to take you from sun-soaked mornings to party nights, city drinks to beach escapes.
            </p>
          </div>
        </section>

        {/* 03: PRODUCT GRID (Two centred portrait cards. Preserve image proportions; no stretching or save icons) */}
        <section className="shop-grid-section">
          <div className="shop-products-grid">
            {SHOP_PRODUCTS.map((product) => {
              const isAdding = addingId === product.id;

              return (
                <article key={product.id} className="shop-product-card">
                  {/* Portrait Card Image (no stretching or save icons) */}
                  <div className="shop-product-media-box">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="shop-product-img"
                      loading="lazy"
                    />
                  </div>

                  {/* 04: PRODUCT DETAILS (Left-align Fringe Top, £200 and Add to Bag beneath each image) */}
                  <div className="shop-product-meta">
                    <h2 className="shop-product-title">{product.name}</h2>
                    <p className="shop-product-price">{product.priceFormatted || `£${product.price}`}</p>
                    
                    <div className="shop-product-action-wrapper">
                      <button
                        type="button"
                        className={`shop-add-to-bag-link ${isAdding ? 'adding' : ''}`}
                        onClick={(e) => handleAddClick(e, product)}
                        aria-label={`Add ${product.name} to shopping bag`}
                      >
                        {isAdding ? 'ADDING...' : 'ADD TO BAG'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Luxury Maison Wistoria Shop Footer */}
      <footer className="shop-page-footer">
        <div className="shop-footer-inner">
          <div className="shop-footer-brand">
            <span className="footer-brand-title">MAISON WISTORIA</span>
            <p className="footer-brand-tagline">Haute Couture & Ready-to-Wear</p>
          </div>
          <div className="shop-footer-links">
            <a href="#campaign" onClick={onNavigateHome}>CAMPAIGN</a>
            <a href="#shop">READY-TO-WEAR</a>
            <a href="#atelier">ATELIER</a>
            <a href="#services">CLIENT CARE</a>
          </div>
          <p className="shop-footer-copyright">
            © {CURRENT_YEAR} WISTORIA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
