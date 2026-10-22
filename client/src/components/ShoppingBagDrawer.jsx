import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function ShoppingBagDrawer({ isOpen, onClose, cartData = {}, onUpdateQty, onProceedCheckout }) {
  const {
    items = [],
    subtotal = 0,
    freeShippingThreshold = 300,
    qualifiesForFreeShipping = false,
    remainingForFreeShipping = 300
  } = cartData || {};

  // Which item's + button is currently spinning
  const [spinningId, setSpinningId] = useState(null);

  const safeSubtotal   = Number(subtotal) || 0;
  const safeThreshold  = Number(freeShippingThreshold) || 300;
  const safeRemaining  = Number(remainingForFreeShipping) || (safeSubtotal >= safeThreshold ? 0 : safeThreshold - safeSubtotal);
  const isFree         = qualifiesForFreeShipping || safeSubtotal >= safeThreshold;
  const progressPercent = Math.min(100, Math.max(0, Math.round((safeSubtotal / safeThreshold) * 100)));

  /* ── + button: number disappears → spinner → success toast ─ */
  const handleIncrease = async (item) => {
    if (spinningId === item.id) return;
    setSpinningId(item.id);
    await onUpdateQty?.(item.id, (item.quantity || 1) + 1);
    setTimeout(() => {
      setSpinningId(null);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
        background: '#111111',
        color: '#ffffff',
        iconColor: '#c9a56c',
      });
      Toast.fire({ icon: 'success', title: 'Product added successfully' });
    }, 650);
  };

  /* ── - button: update qty → SweetAlert ─────────────────── */
  const handleDecrease = async (item) => {
    const newQty = (item.quantity || 1) - 1;
    await onUpdateQty?.(item.id, newQty);
    if (newQty > 0) {
      Swal.fire({
        title: 'Quantity Updated',
        text: 'Item quantity has been updated.',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#111111',
        color: '#ffffff',
        iconColor: '#c9a56c',
        confirmButtonColor: '#c9a56c',
        timer: 2500,
        timerProgressBar: true,
      });
    }
  };

  return (
    <>
      <div
        className={`backdrop-dim ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      <aside
        className={`bag-side-drawer ${isOpen ? 'active' : ''}`}
        aria-label="Shopping Bag"
      >
        <div className="drawer-top-row">
          <span className="drawer-brand-heading">SHOPPING BAG</span>
          <button className="close-x-btn" onClick={onClose} aria-label="Close Bag">✕</button>
        </div>

        {/* Dynamic Shipping Meter */}
        <div className="shipping-calc-card">
          <div className="calc-status-msg">
            {isFree ? (
              <span>✨ You have unlocked complimentary standard shipping!</span>
            ) : (
              <span>Add <strong>${safeRemaining.toLocaleString()}</strong> more to enjoy Free Shipping (Orders over ${safeThreshold}).</span>
            )}
          </div>
          <div className="calc-progress-track">
            <div className="calc-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="cart-items-wrap">
          {!items || items.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
              Your shopping bag is currently empty.
            </p>
          ) : (
            items.map((item) => {
              const spinning = spinningId === item.id;
              return (
                <div key={item.id} className="cart-product-row">
                  <img src={item.image || '/images/campaign_01.jpg'} alt={item.name} className="cart-prod-img" />
                  <div className="cart-prod-details">
                    <div>
                      <h5 className="cart-prod-name">{item.name}</h5>
                      <div className="cart-prod-options">{item.color || 'Standard'} • {item.size || 'FR 36'}</div>
                    </div>
                    <div className="cart-qty-bar">
                      <div className="qty-pill">
                        {/* − button */}
                        <button
                          className="qty-step-btn"
                          onClick={() => handleDecrease(item)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>

                        {/* Centre: number OR spinner */}
                        <div className="qty-center-cell">
                          {spinning
                            ? <span className="qty-inline-spinner" aria-hidden="true" />
                            : <span className="qty-num">{item.quantity || 1}</span>
                          }
                        </div>

                        {/* + button */}
                        <button
                          className="qty-step-btn"
                          onClick={() => handleIncrease(item)}
                          disabled={spinning}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-prod-price">
                        ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items && items.length > 0 && (
          <div className="bag-bottom-panel">
            <div className="subtotal-line">
              <span className="subtotal-txt">Subtotal</span>
              <span className="subtotal-val">${safeSubtotal.toLocaleString()}</span>
            </div>
            <button
              className="bag-checkout-btn"
              onClick={() => {
                if (onProceedCheckout) onProceedCheckout();
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
