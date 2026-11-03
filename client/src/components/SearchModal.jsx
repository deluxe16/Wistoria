import React, { useState, useEffect, useRef } from 'react';
import { SHOP_PRODUCTS } from '../data/shopProducts';

export default function SearchModal({ isOpen, onClose, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(() => SHOP_PRODUCTS.slice(0, 6));
  const [popularTags] = useState(['Liquid Gold Gown', 'Fringe Dress', 'Fringe Top', 'Minaudière', 'Overcoat']);
  const inputRef = useRef(null);

  // Lock background scroll and handle ESC key & touch/wheel events when search is opened
  useEffect(() => {
    if (!isOpen) return;

    // Add search-open class to both body and html
    document.body.classList.add('wistoria-search-open');
    document.documentElement.classList.add('wistoria-search-open');

    // Auto-focus input
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent background touch scrolling on mobile
    const preventBackgroundTouch = (e) => {
      const panel = document.querySelector('.search-top-panel');
      if (panel && panel.contains(e.target)) {
        return; // Allow touch/scroll inside search panel
      }
      e.preventDefault();
    };

    // Prevent background wheel scrolling on desktop
    const preventBackgroundWheel = (e) => {
      const panel = document.querySelector('.search-top-panel');
      if (panel && panel.contains(e.target)) {
        return; // Allow wheel scroll inside search panel
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchmove', preventBackgroundTouch, { passive: false });
    document.addEventListener('wheel', preventBackgroundWheel, { passive: false });

    return () => {
      document.body.classList.remove('wistoria-search-open');
      document.documentElement.classList.remove('wistoria-search-open');
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchmove', preventBackgroundTouch);
      document.removeEventListener('wheel', preventBackgroundWheel);
    };
  }, [isOpen, onClose]);

  // Live client-side filtering + server API search
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.toLowerCase().trim();

    // 1. Instant client-side filter against SHOP_PRODUCTS
    if (!trimmed) {
      setResults(SHOP_PRODUCTS.slice(0, 6));
    } else {
      const clientFiltered = SHOP_PRODUCTS.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(trimmed);
        const colorMatch = p.color?.toLowerCase().includes(trimmed);
        const catMatch = p.category?.toLowerCase().includes(trimmed);
        const descMatch = (p.shortDescription || p.fullDescription || '')?.toLowerCase().includes(trimmed);
        return nameMatch || colorMatch || catMatch || descMatch;
      });
      setResults(clientFiltered);
    }

    // 2. Also query backend API to complement results if running
    const fetchServerSearch = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.results) && data.results.length > 0) {
            setResults(data.results);
          }
        }
      } catch (err) {
        // Fallback already active from client filter
      }
    };

    const debounce = setTimeout(fetchServerSearch, 200);
    return () => clearTimeout(debounce);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`backdrop-dim ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <div 
        className={`search-top-panel ${isOpen ? 'active' : ''}`} 
        aria-label="Search Products"
        role="dialog"
        aria-modal="true"
      >
        <div className="search-top-header">
          <span className="search-brand-label">SEARCH CATALOG</span>
          <button 
            className="close-x-btn" 
            onClick={onClose} 
            aria-label="Close Search"
            id="btn-close-search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        <div className="search-field-box">
          <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            className="search-live-input" 
            placeholder="Search dresses, gowns, tops, bags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button 
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="search-tags-row">
          <span className="search-tags-label">Trending:</span>
          {popularTags.map((tag, i) => (
            <button 
              key={i} 
              className={`search-tag-chip ${query.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
              onClick={() => {
                setQuery(tag);
                inputRef.current?.focus();
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="search-empty-state">
            <p className="search-empty-title">No products found</p>
            <p className="search-empty-sub">
              We couldn't find any items matching "{query}". Try searching for 'Gown', 'Gold', 'Fringe', or 'Dress'.
            </p>
          </div>
        ) : (
          <div className="search-cards-grid">
            {results.map((prod) => (
              <div 
                key={prod.id} 
                className="search-card"
                onClick={() => {
                  window.location.hash = `#product/${prod.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onClose();
                }}
              >
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="search-card-thumb" 
                />
                <div className="search-card-info">
                  <div className="search-card-title">
                    {prod.name}
                  </div>
                  {prod.color && (
                    <div className="search-card-color">{prod.color}</div>
                  )}
                  <div className="search-card-price">
                    ${(prod.price || 200).toLocaleString()}
                  </div>
                  <button 
                    className="search-add-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod.id);
                      onClose();
                    }}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
