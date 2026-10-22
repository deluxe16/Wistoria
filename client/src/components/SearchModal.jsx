import React, { useState, useEffect } from 'react';

const FALLBACK_PRODUCTS = [
  {
    id: "prod-01",
    name: "Cascading Fringe Batwing Dress",
    color: "Ivory White",
    price: 150,
    image: "/images/product_fringe_dress.jpg"
  },
  {
    id: "prod-02",
    name: "Cylindrical Metallic Minaudière",
    color: "Mirror Silver",
    price: 175,
    image: "/images/product_cylinder_clutch.jpg"
  },
  {
    id: "prod-03",
    name: "Draped Silk Fringe Tunic Dress",
    color: "Rich Espresso",
    price: 165,
    image: "/images/campaign_01.jpg"
  },
  {
    id: "prod-04",
    name: "Sculptural Liquid Gold Gown",
    color: "Antique Champagne",
    price: 185,
    image: "/images/campaign_02.jpg"
  },
  {
    id: "prod-05",
    name: "Architectural Wool Fringe Overcoat",
    color: "Obsidian Black",
    price: 180,
    image: "/images/campaign_03.jpg"
  }
];

export default function SearchModal({ isOpen, onClose, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(FALLBACK_PRODUCTS.slice(0, 3));
  const [popularTags, setPopularTags] = useState(['Fringe Dress', 'Minaudière', 'Runway', 'Silk Gown']);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSearch = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        if (data.popular) setPopularTags(data.popular);
      } catch (err) {
        console.error("Search error:", err);
        const q = query.toLowerCase().trim();
        const filtered = q
          ? FALLBACK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.color.toLowerCase().includes(q))
          : FALLBACK_PRODUCTS.slice(0, 3);
        setResults(filtered);
      }
    };
    const debounce = setTimeout(fetchSearch, 150);
    return () => clearTimeout(debounce);
  }, [query, isOpen]);

  return (
    <>
      <div 
        className={`backdrop-dim ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <div className={`search-top-panel ${isOpen ? 'active' : ''}`} aria-label="Search Products">
        <div style={{ width: '100%', maxWidth: '640px', display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="close-x-btn" onClick={onClose} aria-label="Close Search">✕</button>
        </div>

        <div className="search-field-box">
          <input 
            type="text" 
            className="search-live-input" 
            placeholder="Search dresses, bags, runway pieces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={isOpen}
          />
        </div>

        <div className="search-tags-row">
          <span className="search-tags-label">Trending:</span>
          {popularTags.map((tag, i) => (
            <button 
              key={i} 
              className="search-tag-chip" 
              onClick={() => setQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="search-cards-grid">
          {results.map((prod) => (
            <div key={prod.id} className="search-card">
              <img src={prod.image} alt={prod.name} className="search-card-thumb" />
              <div className="search-card-title">{prod.name}</div>
              <div className="search-card-price">${prod.price.toLocaleString()}</div>
              <button 
                className="search-add-btn" 
                onClick={() => {
                  onAddToCart(prod.id);
                  onClose();
                }}
              >
                Add to Bag
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
