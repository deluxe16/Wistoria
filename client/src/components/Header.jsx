import React from 'react';

export default function Header({ 
  onOpenMenu, 
  onOpenSearch, 
  onOpenBag, 
  cartCount 
}) {
  return (
    <header className="hero-header">
      {/* 03: MENU (Fine hamburger icon) */}
      <div className="header-col-left">
        <button 
          className="icon-action-btn" 
          onClick={onOpenMenu} 
          aria-label="Open Navigation Menu"
          id="btn-menu-toggle"
        >
          <div className="fine-hamburger">
            <span className="fine-line"></span>
            <span className="fine-line"></span>
            <span className="fine-line"></span>
          </div>
        </button>
      </div>

      {/* 02: WISTORIA LOGO (Centered luxury serif) */}
      <div className="header-col-center">
        <h1 className="wistoria-brand" id="brand-heading">
          WISTORIA
        </h1>
      </div>

      {/* 04: SEARCH & 05: SHOPPING BAG */}
      <div className="header-col-right">
        <button 
          className="icon-action-btn" 
          onClick={onOpenSearch} 
          aria-label="Search Catalog"
          id="btn-search-toggle"
        >
          <svg className="fine-icon-svg" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7.5" stroke="currentColor" fill="none" />
            <path d="M16.5 16.5L21.5 21.5" stroke="currentColor" strokeLinecap="round" />
          </svg>
        </button>

        <button 
          className="icon-action-btn" 
          onClick={onOpenBag} 
          aria-label="View Shopping Bag"
          id="btn-cart-toggle"
        >
          <svg className="fine-icon-svg" viewBox="0 0 24 24">
            <path d="M4.5 8.5H19.5L18.5 21.5H5.5L4.5 8.5Z" stroke="currentColor" strokeLinejoin="round" fill="none" />
            <path d="M9 8.5V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8.5" stroke="currentColor" strokeLinecap="round" fill="none" />
          </svg>
          {cartCount > 0 && (
            <span className="bag-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
