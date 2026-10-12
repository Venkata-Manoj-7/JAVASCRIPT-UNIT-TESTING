import { describe, it, expect, vi } from 'vitest';
import {
  getShippingInfo,
  getPriceInCurrency,
  renderPage,
  submitOrder
} from '../src/mocking.js';

import * as paymentLib from '../src/libs/payment.js';
import * as analyticsLib from '../src/libs/analytics.js';
// PART 1: Real Internal Module Integration
// Testing mocking.js + libs/ modules working together

describe('Integration: Business Logic + Internal Libs', () => {

  it('should integrate getShippingInfo with libs/shipping.js to return shipping details', () => {
    // Calling getShippingInfo executes the real getShippingQuote inside libs/shipping.js
    const result = getShippingInfo('US');

    // Verify both modules integrated and produced the expected formatted string
    expect(result).toMatch(/Shipping Cost:/i);
    expect(result).toMatch(/Days/i);
  });

  it('should integrate getPriceInCurrency with libs/currency.js to calculate exchange rates', () => {
    // Calling getPriceInCurrency executes the real getExchangeRate inside libs/currency.js
    const convertedPrice = getPriceInCurrency(100, 'EUR');

    expect(typeof convertedPrice).toBe('number');
    expect(convertedPrice).toBeGreaterThan(0);
  });

});

// PART 2: System Boundary Integration (I/O & Service Spies)
// Testing integration while controlling external side-effects

describe('Integration: Order & Analytics Services', () => {

  it('should integrate submitOrder with payment.js using a service spy', async () => {
    // Spy on paymentLib.charge to simulate API response without making network calls
    vi.spyOn(paymentLib, 'charge').mockResolvedValue({ status: 'success' });

    const response = await submitOrder({ totalAmount: 250 }, 'credit_card_456');

    // Assert that payment integration logic processed success correctly
    expect(response).toEqual({ success: true });
    expect(paymentLib.charge).toHaveBeenCalledWith('credit_card_456', 250);
  });

  it('should integrate renderPage with analytics.js to track user pageviews', async () => {
    // Spy on trackPageView to ensure interaction occurs during page rendering
    const analyticsSpy = vi.spyOn(analyticsLib, 'trackPageView');

    const html = await renderPage();

    expect(html).toBe('<div>content</div>');
    expect(analyticsSpy).toHaveBeenCalledWith('/home');
  });

});

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { submitOrder, getShippingInfo, getPriceInCurrency, renderPage } from '../src/mocking.js';
import * as paymentLib from '../src/libs/payment.js';

describe('Integration Tests - Core Modules & Lifecycle Hooks', () => {

  beforeAll(() => {
    process.env.TEST_ENV = 'true';
  });

  // Task 3: Setup hook - attach spy before every test
  beforeEach(() => {
    vi.spyOn(paymentLib, 'charge').mockResolvedValue({ status: 'success', transactionId: 'tx_123' });
  });

  // Task 3: Teardown hook - reset call history and restore function implementations
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    delete process.env.TEST_ENV;
  });

  it('should integrate getShippingInfo with libs/shipping.js to return shipping details', () => {
    const info = getShippingInfo('US', 5);
    // Fix 1: Expect string output matching return format
    expect(info).toContain('Shipping Cost');
  });

  it('should process order through paymentLib service boundary', async () => {
    // Fix 2: Pass totalAmount so paymentLib.charge receives 250
    const result = await submitOrder({ totalAmount: 250 }, 'card_789');

    expect(paymentLib.charge).toHaveBeenCalledWith('card_789', 250);
    expect(paymentLib.charge).toHaveBeenCalledTimes(1);
  });

  it('should verify call counters reset to 0 for a clean test run', async () => {
    // Passes cleanly because afterEach ran vi.restoreAllMocks()!
    expect(paymentLib.charge).toHaveBeenCalledTimes(0);

    await submitOrder({ totalAmount: 50 }, 'card_111');
    expect(paymentLib.charge).toHaveBeenCalledTimes(1);
  });
});