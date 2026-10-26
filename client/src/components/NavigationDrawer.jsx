import React, { useEffect } from 'react';

export default function NavigationDrawer({ isOpen, onClose }) {
  // Navigation items matching REFERENCE 02A (MOBILE MENU) & 02B (DESKTOP MENU)
  const navLinks = [
    { label: "SHOP", href: "#shop" },
    { label: "CONTACT", href: "#contact" },
    { label: "TERMS & CONDITIONS", href: "#terms" },
    { label: "WORLD OF WISTORIA", href: "#world-of-wistoria" }
  ];

  // Manage body class and Escape key when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('wistoria-menu-open');
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('wistoria-menu-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.classList.remove('wistoria-menu-open');
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Clickable backdrop overlay */}
      <div 
        className={`wistoria-menu-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Top dropdown menu overlay */}
      <nav 
        className={`wistoria-top-menu ${isOpen ? 'active' : ''}`}
        aria-label="Navigation Menu"
        aria-hidden={!isOpen}
      >
        {/* Pure white menu sheet (stops at ~72vh, leaving campaign strip downwards) */}
        <div className="wistoria-menu-sheet">
          {/* Top header row inside menu: Close button (X) aligned to top-right */}
          <div className="wistoria-menu-header">
            <button 
              className="wistoria-menu-close-btn" 
              onClick={onClose} 
              aria-label="Close menu"
              id="btn-close-menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" />
                <line x1="19.5" y1="4.5" x2="4.5" y2="19.5" />
              </svg>
            </button>
          </div>

          {/* Menu links list with delicate typography and generous vertical spacing */}
          <ul className="wistoria-menu-nav">
            {navLinks.map((item, idx) => (
              <li key={idx} className="wistoria-menu-nav-item">
                <a 
                  href={item.href} 
                  onClick={onClose}
                  className="wistoria-menu-link"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Transparent bottom area allowing the real homepage image to continue seamlessly below the white sheet */}
        <div 
          className="wistoria-menu-bottom-space" 
          onClick={onClose}
          aria-hidden="true"
          title="Click to close menu"
        />
      </nav>
    </>
  );
}

