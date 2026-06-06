/**
 * ========================================================
 *  THE CUBE CLUB — ROI Calculator
 * ========================================================
 *  Interactive investment return calculator with animated
 *  numbers, SVG donut chart, and Indian currency formatting.
 *  Dependency: GSAP (global)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------
  //  DOM REFERENCES
  // --------------------------------------------------
  const sliderEl          = document.getElementById('investment-amount');
  const amountDisplayEl   = document.getElementById('investment-amount-display');
  const durationEl        = document.getElementById('investment-duration');
  const returnTypeEl      = document.getElementById('return-type');
  const totalReturnEl     = document.getElementById('roi-total-return');
  const monthlyIncomeEl   = document.getElementById('roi-monthly-income');
  const appreciationEl    = document.getElementById('roi-appreciation');
  const chartContainer    = document.getElementById('roi-chart');

  // Bail out gracefully if essential elements are missing
  if (!sliderEl || !totalReturnEl) return;

  // --------------------------------------------------
  //  CONSTANTS & DEFAULTS
  // --------------------------------------------------
  const ANNUAL_RETURN_RATE   = 0.12;  // 12% combined
  const RENTAL_YIELD         = 0.08;  // 8% rental yield
  const APPRECIATION_RATE    = 0.04;  // 4% appreciation

  const SLIDER_MIN   = 5_000_000;   // ₹50 Lakh
  const SLIDER_MAX   = 50_000_000;  // ₹5 Cr
  const SLIDER_STEP  = 500_000;     // ₹5 Lakh steps

  let currentAmount   = 10_000_000; // ₹1 Cr default
  let currentDuration = 5;          // years
  let currentReturnType = 'yearly'; // 'monthly' | 'yearly'

  // Animated proxy values for smooth number transitions
  const animProxy = {
    totalReturn: 0,
    monthlyIncome: 0,
    appreciation: 0,
  };

  // --------------------------------------------------
  //  HELPERS
  // --------------------------------------------------

  /**
   * Format a number into Indian currency notation.
   * Returns strings like "₹1.50 Cr" or "₹75.00 L"
   */
  function formatIndianCurrency(num) {
    const abs = Math.abs(num);
    if (abs >= 1_00_00_000) {
      return `₹${(num / 1_00_00_000).toFixed(2)} Cr`;
    }
    if (abs >= 1_00_000) {
      return `₹${(num / 1_00_000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  }

  /**
   * Update the slider track gradient to visually fill the
   * "active" portion in gold.
   */
  function updateSliderTrack() {
    const pct =
      ((sliderEl.value - sliderEl.min) / (sliderEl.max - sliderEl.min)) * 100;

    sliderEl.style.background = `linear-gradient(
      to right,
      var(--color-gold, #c9a96e) ${pct}%,
      rgba(0, 0, 0, 0.1) ${pct}%
    )`;
  }

  // --------------------------------------------------
  //  SVG DONUT CHART
  // --------------------------------------------------
  // Chart geometry
  const CHART_RADIUS      = 80;
  const CHART_CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

  /**
   * Update (or create) the SVG donut chart showing the
   * split between the original investment and returns.
   */
  function updateDonutChart(investment, returns) {
    if (!chartContainer) return;

    const total       = investment + returns;
    const investPct   = total > 0 ? investment / total : 0.5;
    const returnsPct  = 1 - investPct;

    // Dash values
    const investDash  = CHART_CIRCUMFERENCE * investPct;
    const returnsDash = CHART_CIRCUMFERENCE * returnsPct;

    // Build SVG if it doesn't exist yet
    if (!chartContainer.querySelector('svg')) {
      chartContainer.innerHTML = `
        <svg viewBox="0 0 200 200" width="200" height="200" aria-label="ROI donut chart">
          <!-- Returns arc (gold) -->
          <circle
            class="donut-returns"
            cx="100" cy="100" r="${CHART_RADIUS}"
            fill="none"
            stroke="var(--color-gold, #c9a96e)"
            stroke-width="20"
            stroke-dasharray="0 ${CHART_CIRCUMFERENCE}"
            stroke-dashoffset="0"
            transform="rotate(-90 100 100)"
            stroke-linecap="round"
          />
          <!-- Investment arc (charcoal) -->
          <circle
            class="donut-invest"
            cx="100" cy="100" r="${CHART_RADIUS}"
            fill="none"
            stroke="var(--color-charcoal, #2a2a2a)"
            stroke-width="20"
            stroke-dasharray="0 ${CHART_CIRCUMFERENCE}"
            stroke-dashoffset="0"
            transform="rotate(-90 100 100)"
            stroke-linecap="round"
          />
          <!-- Centre label -->
          <text x="100" y="95" text-anchor="middle" fill="var(--color-gold, #c9a96e)"
                font-size="14" font-weight="600" class="donut-label-top">Returns</text>
          <text x="100" y="115" text-anchor="middle" fill="#fff"
                font-size="12" class="donut-label-bottom"></text>
        </svg>`;
    }

    const investCircle  = chartContainer.querySelector('.donut-invest');
    const returnsCircle = chartContainer.querySelector('.donut-returns');
    const labelBottom   = chartContainer.querySelector('.donut-label-bottom');

    // Animate arcs with GSAP
    gsap.to(returnsCircle, {
      attr: { 'stroke-dasharray': `${returnsDash} ${CHART_CIRCUMFERENCE}` },
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to(investCircle, {
      attr: {
        'stroke-dasharray': `${investDash} ${CHART_CIRCUMFERENCE}`,
        'stroke-dashoffset': `-${returnsDash}`,
      },
      duration: 0.8,
      ease: 'power2.out',
    });

    if (labelBottom) {
      labelBottom.textContent = `${Math.round(returnsPct * 100)}% returns`;
    }
  }

  // --------------------------------------------------
  //  CORE CALCULATION
  // --------------------------------------------------
  function recalculate() {
    const amount   = currentAmount;
    const years    = currentDuration;

    // Total compounded value
    const totalValue        = amount * Math.pow(1 + ANNUAL_RETURN_RATE, years);

    // Monthly rental income
    const monthlyRental     = (amount * RENTAL_YIELD) / 12;

    // Appreciation gain
    const appreciationGain  = amount * Math.pow(1 + APPRECIATION_RATE, years) - amount;

    // Total rental collected over the period
    const totalRental       = monthlyRental * 12 * years;

    // Combined return
    const totalReturn       = totalRental + appreciationGain;

    // Animate the numbers smoothly
    gsap.to(animProxy, {
      totalReturn,
      duration: 1,
      ease: 'power2.out',
      snap: { totalReturn: 1000 },
      onUpdate: () => {
        if (totalReturnEl) {
          totalReturnEl.textContent = formatIndianCurrency(animProxy.totalReturn);
        }
      },
    });

    gsap.to(animProxy, {
      monthlyIncome: monthlyRental,
      duration: 1,
      ease: 'power2.out',
      snap: { monthlyIncome: 100 },
      onUpdate: () => {
        if (monthlyIncomeEl) {
          monthlyIncomeEl.textContent = formatIndianCurrency(animProxy.monthlyIncome);
        }
      },
    });

    gsap.to(animProxy, {
      appreciation: appreciationGain,
      duration: 1,
      ease: 'power2.out',
      snap: { appreciation: 1000 },
      onUpdate: () => {
        if (appreciationEl) {
          appreciationEl.textContent = formatIndianCurrency(animProxy.appreciation);
        }
      },
    });

    // Donut chart
    updateDonutChart(amount, totalReturn);
  }

  // --------------------------------------------------
  //  EVENT BINDINGS
  // --------------------------------------------------

  // Slider
  if (sliderEl) {
    sliderEl.min   = SLIDER_MIN;
    sliderEl.max   = SLIDER_MAX;
    sliderEl.step  = SLIDER_STEP;
    sliderEl.value = currentAmount;

    sliderEl.addEventListener('input', () => {
      currentAmount = parseInt(sliderEl.value, 10);
      if (amountDisplayEl) {
        amountDisplayEl.textContent = formatIndianCurrency(currentAmount);
      }
      updateSliderTrack();
      recalculate();
    });

    // Set initial track fill
    updateSliderTrack();
  }

  // Duration select
  if (durationEl) {
    durationEl.value = currentDuration;
    durationEl.addEventListener('change', () => {
      currentDuration = parseInt(durationEl.value, 10) || 5;
      recalculate();
    });
  }

  // Return type toggle (monthly / yearly display)
  if (returnTypeEl) {
    returnTypeEl.addEventListener('change', () => {
      currentReturnType = returnTypeEl.value;
      recalculate();
    });
  }

  // --------------------------------------------------
  //  INITIAL RENDER
  // --------------------------------------------------
  if (amountDisplayEl) {
    amountDisplayEl.textContent = formatIndianCurrency(currentAmount);
  }
  recalculate();
});
