import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroSlideshow from './components/HeroSlideshow';
import NavigationDrawer from './components/NavigationDrawer';
import SearchModal from './components/SearchModal';
import ShoppingBagDrawer from './components/ShoppingBagDrawer';
import CheckoutModal from './components/CheckoutModal';

const DEFAULT_ANNOUNCEMENT = {
  message: "Free shipping for orders over $300",
  freeShippingThreshold: 300,
  currency: "USD",
  currencySymbol: "$"
};

const DEFAULT_SLIDES = [
  { 
    id: 1, 
    image: "/images/campaign_01.jpg", 
    caption: "Wistoria Haute Couture — Cascading Silk Fringe Look",
    objectPosition: "center top"
  },
  { 
    id: 2, 
    image: "/images/campaign_02.jpg", 
    caption: "Sculptural Draped Eveningwear in Antique White",
    objectPosition: "center top"
  },
  { 
    id: 3, 
    image: "/images/campaign_03.jpg", 
    caption: "Floral Embroidered Caftan with Artisanal Fringe",
    objectPosition: "center top"
  }
];

const DEFAULT_MENU = {
  mainCategories: [
    {
      title: "COLLECTIONS",
      items: [
        { name: "Winter Haute Couture 2026", url: "#winter-2026", isHighlight: true },
        { name: "The Fringe Edit", url: "#fringe-edit" },
        { name: "Runway Lookbook", url: "#lookbook" },
        { name: "Archive & Editions", url: "#archive" }
      ]
    },
    {
      title: "READY-TO-WEAR",
      items: [
        { name: "All Ready-to-Wear", url: "#all-rtw" },
        { name: "Dresses & Gowns", url: "#dresses" },
        { name: "Coats & Outerwear", url: "#coats" },
        { name: "Tailoring & Jackets", url: "#tailoring" }
      ]
    },
    {
      title: "ACCESSORIES & BAGS",
      items: [
        { name: "Minaudières & Clutches", url: "#clutches" },
        { name: "Structured Leather Bags", url: "#leather" },
        { name: "Footwear & Boots", url: "#footwear" }
      ]
    },
    {
      title: "MAISON WISTORIA",
      items: [
        { name: "The Philosophy", url: "#philosophy" },
        { name: "Craftsmanship & Atelier", url: "#atelier" },
        { name: "Stores & Salons", url: "#stores" }
      ]
    }
  ]
};

const DEFAULT_CART = {
  items: [
    {
      id: "cart-item-1",
      productId: "prod-01",
      name: "Cascading Fringe Batwing Dress",
      color: "Ivory White",
      size: "FR 36",
      price: 150,
      quantity: 1,
      image: "/images/product_fringe_dress.jpg"
    }
  ],
  itemCount: 1,
  subtotal: 150,
  freeShippingThreshold: 300,
  qualifiesForFreeShipping: false,
  remainingForFreeShipping: 150
};

export default function App() {
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [slides, setSlides]             = useState(DEFAULT_SLIDES);
  const [menuData, setMenuData]         = useState(DEFAULT_MENU);
  const [cartData, setCartData]         = useState(DEFAULT_CART);

  const [isMenuOpen,     setIsMenuOpen]     = useState(false);
  const [isSearchOpen,   setIsSearchOpen]   = useState(false);
  const [isBagOpen,      setIsBagOpen]      = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* ── Fetch backend data ─────────────────────────────────── */
  useEffect(() => {
    fetch('/api/announcement')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAnnouncement(d))
      .catch(() => {});

    fetch('/api/slides')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => Array.isArray(d) && d.length > 0 && setSlides(d))
      .catch(() => {});

    fetch('/api/navigation')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setMenuData(d))
      .catch(() => {});

    fetch('/api/cart')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCartData(d))
      .catch(() => {});
  }, []);

  /* ── Payment success: clear cart ────────────────────────── */
  const handlePaymentSuccess = async () => {
    const threshold = Number(announcement?.freeShippingThreshold) || 300;
    setCartData({
      items: [], itemCount: 0, subtotal: 0,
      currencySymbol: "$", freeShippingThreshold: threshold,
      qualifiesForFreeShipping: false, remainingForFreeShipping: threshold
    });
    try { await fetch('/api/cart/clear', { method: 'POST' }); } catch (_) {}
  };

  /* ── Add to cart ────────────────────────────────────────── */
  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size: 'FR 36' })
      });
      if (res.ok) {
        const data = await res.json();
        setCartData(data);
        setIsBagOpen(true);
        return;
      }
    } catch (_) {}

    // Client fallback
    const catalog = [
      { id: "prod-01", name: "Cascading Fringe Batwing Dress",     price: 150, image: "/images/product_fringe_dress.jpg",    color: "Ivory White"       },
      { id: "prod-02", name: "Cylindrical Metallic Minaudière",    price: 175, image: "/images/product_cylinder_clutch.jpg", color: "Mirror Silver"     },
      { id: "prod-03", name: "Draped Silk Fringe Tunic Dress",     price: 165, image: "/images/campaign_01.jpg",             color: "Rich Espresso"     },
      { id: "prod-04", name: "Sculptural Liquid Gold Gown",        price: 185, image: "/images/campaign_02.jpg",             color: "Antique Champagne" },
      { id: "prod-05", name: "Architectural Wool Fringe Overcoat", price: 180, image: "/images/campaign_03.jpg",             color: "Obsidian Black"    }
    ];
    const prod = catalog.find((p) => p.id === productId) || {
      id: productId, name: "Luxury Piece", price: 150, image: "/images/campaign_01.jpg"
    };

    setCartData((prev) => {
      const items = [...(prev?.items || [])];
      const idx   = items.findIndex((i) => i.productId === productId);
      if (idx > -1) {
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
      } else {
        items.push({
          id: `cart-item-${Date.now()}`, productId: prod.id,
          name: prod.name, color: prod.color || "Ivory White",
          size: "FR 36", price: prod.price, quantity: 1, image: prod.image
        });
      }
      const itemCount = items.reduce((s, i) => s + i.quantity, 0);
      const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const threshold = Number(prev?.freeShippingThreshold) || 300;
      const qualifies = subtotal >= threshold;
      return {
        ...prev, items, itemCount, subtotal,
        qualifiesForFreeShipping: qualifies,
        remainingForFreeShipping: qualifies ? 0 : threshold - subtotal
      };
    });
    setIsBagOpen(true);
  };

  /* ── Update quantity ────────────────────────────────────── */
  const handleUpdateQty = async (itemId, quantity) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        const data = await res.json();
        setCartData(data);
        return;
      }
    } catch (_) {}

    // Client fallback
    setCartData((prev) => {
      let items = [...(prev?.items || [])];
      const idx = items.findIndex((i) => i.id === itemId);
      if (idx > -1) {
        if (quantity <= 0) items.splice(idx, 1);
        else items[idx] = { ...items[idx], quantity };
      }
      const itemCount = items.reduce((s, i) => s + i.quantity, 0);
      const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const threshold = Number(prev?.freeShippingThreshold) || 300;
      const qualifies = subtotal >= threshold;
      return {
        ...prev, items, itemCount, subtotal,
        qualifiesForFreeShipping: qualifies,
        remainingForFreeShipping: qualifies ? 0 : threshold - subtotal
      };
    });
  };

  return (
    <div className="app-container">
      {/* 01: Top Announcement Bar */}
      <AnnouncementBar text={announcement?.message || "Free shipping for orders over $300"} />

      {/* Main Hero Container */}
      <div className="hero-viewport">
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBag={() => setIsBagOpen(true)}
          cartCount={cartData?.itemCount || 0}
        />
        <HeroSlideshow slides={slides} />
      </div>

      {/* Slide-out Drawers & Modals */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuData={menuData}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <ShoppingBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        cartData={cartData}
        onUpdateQty={handleUpdateQty}
        onProceedCheckout={() => {
          setIsBagOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartData={cartData}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
