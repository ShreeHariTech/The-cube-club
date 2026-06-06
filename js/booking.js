/**
 * ========================================================
 *  THE CUBE CLUB — Booking Bar Interactions
 * ========================================================
 *  Handles date pickers, guest counter, form submission,
 *  and an elegant toast notification system.
 *  Dependency: GSAP (global)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------
  //  DOM REFERENCES
  // --------------------------------------------------
  const checkinInput   = document.getElementById('checkin-date');
  const checkoutInput  = document.getElementById('checkout-date');
  const guestDisplay   = document.getElementById('guest-count');
  const submitBtn      = document.getElementById('booking-submit');
  const minusBtn       = document.querySelector('.guest-minus');
  const plusBtn        = document.querySelector('.guest-plus');

  // --------------------------------------------------
  //  HELPERS
  // --------------------------------------------------
  /** Return today's date as 'YYYY-MM-DD' */
  function todayISO() {
    return new Date().toISOString().split('T')[0];
  }

  /** Return tomorrow's date as 'YYYY-MM-DD' */
  function tomorrowISO() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  // --------------------------------------------------
  //  DATE INPUTS
  // --------------------------------------------------
  const today    = todayISO();
  const tomorrow = tomorrowISO();

  if (checkinInput) {
    checkinInput.value = today;
    checkinInput.min   = today;

    checkinInput.addEventListener('change', () => {
      // Ensure checkout is always after checkin
      if (checkoutInput) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        const minCheckout = nextDay.toISOString().split('T')[0];
        checkoutInput.min = minCheckout;

        if (checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = minCheckout;
        }
      }
    });
  }

  if (checkoutInput) {
    checkoutInput.value = tomorrow;
    checkoutInput.min   = tomorrow;
  }

  // --------------------------------------------------
  //  GUEST COUNTER
  // --------------------------------------------------
  const GUEST_MIN = 1;
  const GUEST_MAX = 10;

  function clampGuests(val) {
    return Math.min(GUEST_MAX, Math.max(GUEST_MIN, val));
  }

  function getGuestCount() {
    return parseInt(guestDisplay?.textContent, 10) || 2;
  }

  function setGuestCount(val) {
    const clamped = clampGuests(val);
    if (guestDisplay) guestDisplay.textContent = clamped;
    // Update button states
    if (minusBtn) minusBtn.disabled = clamped <= GUEST_MIN;
    if (plusBtn)  plusBtn.disabled  = clamped >= GUEST_MAX;
  }

  if (guestDisplay) {
    setGuestCount(getGuestCount());
  }

  if (minusBtn) {
    minusBtn.addEventListener('click', () => setGuestCount(getGuestCount() - 1));
  }

  if (plusBtn) {
    plusBtn.addEventListener('click', () => setGuestCount(getGuestCount() + 1));
  }

  // --------------------------------------------------
  //  TOAST NOTIFICATION SYSTEM
  // --------------------------------------------------
  /**
   * Show a luxury-styled toast notification.
   * @param {string} message  — Text content
   * @param {number} duration — Visible time in ms (default 3000)
   */
  function showToast(message, duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <span class="toast-notification__icon">✓</span>
      <span class="toast-notification__message">${message}</span>
    `;

    // Inline styles — glass morphism, gold accent
    Object.assign(toast.style, {
      position:       'fixed',
      top:            '0',
      left:           '50%',
      transform:      'translateX(-50%) translateY(-100%)',
      zIndex:         '10000',
      display:        'flex',
      alignItems:     'center',
      gap:            '12px',
      padding:        '16px 28px',
      borderRadius:   '8px',
      background:     'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      border:         '1px solid rgba(201, 169, 110, 0.4)',
      boxShadow:      '0 8px 32px rgba(0, 0, 0, 0.3)',
      fontFamily:     'inherit',
      fontSize:       '15px',
      color:          '#fff',
      pointerEvents:  'none',
      maxWidth:       '90vw',
    });

    // Icon styling
    const icon = toast.querySelector('.toast-notification__icon');
    if (icon) {
      Object.assign(icon.style, {
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        width:        '28px',
        height:       '28px',
        borderRadius: '50%',
        background:   'var(--color-gold, #c9a96e)',
        color:        '#fff',
        fontWeight:   '700',
        fontSize:     '14px',
        flexShrink:   '0',
      });
    }

    document.body.appendChild(toast);

    // GSAP animation: slide down → pause → slide up → remove
    const tl = gsap.timeline({
      onComplete: () => toast.remove(),
    });

    tl.to(toast, {
      y: 30,                       // 30px from top of viewport
      duration: 0.5,
      ease: 'power3.out',
    })
    .to(toast, {
      y: -120,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      delay: duration / 1000,
    });
  }

  // --------------------------------------------------
  //  FORM SUBMISSION
  // --------------------------------------------------
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Basic validation
      if (checkinInput && !checkinInput.value) {
        showToast('Please select a check-in date.');
        return;
      }
      if (checkoutInput && !checkoutInput.value) {
        showToast('Please select a check-out date.');
        return;
      }

      // Success feedback
      showToast('Thank you! Our team will confirm your booking shortly.');
    });
  }

  // --------------------------------------------------
  //  CONTACT FORM SUBMISSION
  // --------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for your interest! Our team will reach out within 24 hours.');
      contactForm.reset();
    });
  }
});
