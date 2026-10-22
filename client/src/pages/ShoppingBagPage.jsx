import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ShoppingBagPage({
  cartData = {},
  onUpdateQty,
  onProceedCheckout,
}) {
  const navigate = useNavigate();
  const {
    items = [],
    subtotal = 0,
    freeShippingThreshold = 300,
    qualifiesForFreeShipping = false,
  } = cartData || {};

  const [spinningId, setSpinningId] = useState(null);

  const safeSubtotal  = Number(subtotal) || 0;
  const safeThreshold = Number(freeShippingThreshold) || 300;
  const safeRemaining = Math.max(0, safeThreshold - safeSubtotal);
  const isFree        = qualifiesForFreeShipping || safeSubtotal >= safeThreshold;
  const progressPct   = Math.min(100, Math.round((safeSubtotal / safeThreshold) * 100));

  /* ── Increase (+ button): spin → toast ─────────────────── */
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

  /* ── Decrease (- button): update + SweetAlert ──────────── */
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
    <div className="sbp-root">

      {/* ── Back / Header Row ─────────────────────────────── */}
      <div className="sbp-header-row">
        <button className="sbp-back-btn" onClick={() => navigate(-1)} aria-label="Continue shopping">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L11 6M5 12L11 18"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CONTINUE SHOPPING
        </button>
        <h1 className="sbp-page-title">YOUR BAG</h1>
        <span className="sbp-count-label">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* ── Free Shipping Meter ───────────────────────────── */}
      <div className="sbp-ship-meter">
        <p className="sbp-ship-msg">
          {isFree
            ? '✨ You have unlocked complimentary standard shipping!'
            : <>Add <strong>${safeRemaining.toLocaleString()}</strong> more for free shipping (orders over ${safeThreshold})</>}
        </p>
        <div className="sbp-progress-track">
          <div className="sbp-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {items.length === 0 ? (
        /* ── Empty State ───────────────────────────────────── */
        <div className="sbp-empty-state">
          <svg className="sbp-empty-icon" width="72" height="72" viewBox="0 0 24 24" fill="none">
            <path d="M4.5 8.5H19.5L18.5 21.5H5.5L4.5 8.5Z"
              stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
            <path d="M9 8.5V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8.5"
              stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
          </svg>
          <p className="sbp-empty-text">Your shopping bag is currently empty.</p>
          <button className="sbp-browse-btn" onClick={() => navigate(-1)}>
            EXPLORE THE COLLECTION
          </button>
        </div>
      ) : (
        /* ── Main Content Grid ────────────────────────────── */
        <div className="sbp-grid">

          {/* Left column – item list */}
          <div className="sbp-items-col">
            {items.map((item) => {
              const spinning = spinningId === item.id;
              return (
                <div key={item.id} className="sbp-item-card">
                  <img
                    src={item.image || '/images/campaign_01.jpg'}
                    alt={item.name}
                    className="sbp-item-img"
                  />
                  <div className="sbp-item-body">
                    <div>
                      <h3 className="sbp-item-name">{item.name}</h3>
                      <p className="sbp-item-meta">
                        {item.color || 'Standard'} &bull; {item.size || 'FR 36'}
                      </p>
                    </div>

                    <div className="sbp-item-foot">
                      {/* Qty control */}
                      <div className="sbp-qty-pill">
                        <button
                          className="sbp-qty-btn"
                          onClick={() => handleDecrease(item)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <div className="sbp-qty-display">
                          {spinning ? (
                            <span className="sbp-spinner" />
                          ) : (
                            <span className="sbp-qty-num">{item.quantity || 1}</span>
                          )}
                        </div>

                        <button
                          className="sbp-qty-btn sbp-qty-plus"
                          onClick={() => handleIncrease(item)}
                          disabled={spinning}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="sbp-item-price">
                        ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column – order summary */}
          <div className="sbp-summary-col">
            <h2 className="sbp-summary-heading">ORDER SUMMARY</h2>

            <div className="sbp-summary-rows">
              <div className="sbp-sum-row">
                <span>Subtotal</span>
                <span>${safeSubtotal.toLocaleString()}</span>
              </div>
              <div className="sbp-sum-row">
                <span>Shipping</span>
                {isFree
                  ? <span className="sbp-free-tag">Complimentary</span>
                  : <span>Calculated at checkout</span>}
              </div>
              <div className="sbp-sum-divider" />
              <div className="sbp-sum-row sbp-sum-total">
                <span>Estimated Total</span>
                <span>${safeSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <button className="sbp-checkout-btn" onClick={() => onProceedCheckout?.()}>
              PROCEED TO CHECKOUT
            </button>

            <p className="sbp-secure-note">🔒 Secured by Paystack</p>
          </div>
        </div>
      )}
    </div>
  );
}
