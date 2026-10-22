import React from 'react';

export default function NavigationDrawer({ isOpen, onClose, menuData }) {
  if (!menuData) return null;

  return (
    <>
      <div 
        className={`backdrop-dim ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <aside 
        className={`menu-side-drawer ${isOpen ? 'active' : ''}`}
        aria-label="Navigation Menu"
      >
        <div className="drawer-top-row">
          <span className="drawer-brand-heading">WISTORIA</span>
          <button className="close-x-btn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        {menuData.mainCategories?.map((category, idx) => (
          <div key={idx} className="nav-cat-group">
            <h4 className="nav-cat-title">{category.title}</h4>
            <ul className="nav-link-list">
              {category.items?.map((item, itemIdx) => (
                <li 
                  key={itemIdx} 
                  className={`nav-link-item ${item.isHighlight ? 'featured' : ''}`}
                >
                  <a href={item.url} onClick={onClose}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
    </>
  );
}
