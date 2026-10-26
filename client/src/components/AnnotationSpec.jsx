import React from 'react';

const specs = [
  {
    number: "01",
    label: "SHIPPING MESSAGE",
    instruction: "Free shipping for orders over $300. Small, light lettering."
  },
  {
    number: "02",
    label: "WISTORIA LOGO",
    instruction: "Use the supplied logo unchanged; white over this dark image."
  },
  {
    number: "03",
    label: "MENU",
    instruction: "Fine hamburger icon opens the navigation menu."
  },
  {
    number: "04",
    label: "SEARCH",
    instruction: "Fine search icon opens product search."
  },
  {
    number: "05",
    label: "SHOPPING BAG",
    instruction: "Fine bag icon opens the shopping bag."
  },
  {
    number: "06",
    label: "SLIDESHOW",
    instruction: "Left and right arrows change campaign images; horizontal indicator lines clearly indicate active and next images; allow swipe on mobile."
  },
  {
    number: "07",
    label: "IMAGE FIT",
    instruction: "Desktop: Match this approved crop and composition; image fills the frame without stretching. Mobile: Fit the original photo to the mobile width. Preserve proportions; no extra zoom or horizontal overflow."
  }
];

export default function AnnotationSpec({ activeMarker, onSelectMarker }) {
  return (
    <section className="page-spec-board" aria-label="Developer Specifications">
      <div className="spec-header-tag">PAGE 01 — SPECIFICATIONS & ANNOTATIONS</div>
      <div className="spec-items-grid">
        {specs.map((item) => (
          <div 
            key={item.number} 
            className={`spec-row-item ${activeMarker === item.number ? 'highlighted' : ''}`}
            onClick={() => onSelectMarker(activeMarker === item.number ? null : item.number)}
            style={{ cursor: 'pointer' }}
          >
            <div className="spec-circle-badge">{item.number}</div>
            <div className="spec-text-block">
              <div className="spec-label">{item.label}</div>
              <div className="spec-instruction">{item.instruction}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="spec-disclaimer">
        Numbered markers are developer annotations only and do not appear on the live website.
      </div>
    </section>
  );
}
