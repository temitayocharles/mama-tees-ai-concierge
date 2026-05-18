import { describe, expect, it } from 'vitest';
import { getDeliveryFee, validateDelivery, validateReservation } from '../src/domain/businessRules.js';

describe('delivery rules', () => {
  it('returns the correct Wuse 2 delivery fee', () => {
    expect(getDeliveryFee('Wuse 2')).toBe(500);
  });

  it('rejects Sunday delivery', () => {
    const result = validateDelivery({
      fulfillment_type: 'delivery',
      delivery_area: 'Wuse 2',
      order_total: 4000,
      requested_at: '2026-05-24T12:00:00',
      timezone: 'Africa/Lagos'
    });

    expect(result.allowed).toBe(false);
    expect(result.warnings.join(' ')).toContain('Sundays');
  });

  it('rejects delivery below minimum order amount', () => {
    const result = validateDelivery({
      fulfillment_type: 'delivery',
      delivery_area: 'Garki',
      order_total: 2500,
      requested_at: '2026-05-19T12:00:00',
      timezone: 'Africa/Lagos'
    });

    expect(result.allowed).toBe(false);
    expect(result.warnings.join(' ')).toContain('Minimum delivery order');
  });
});

describe('reservation rules', () => {
  it('rejects reservations for fewer than 5 guests', () => {
    const result = validateReservation({
      guest_count: 4,
      reservation_date: '2026-06-01',
      reservation_time: '18:00:00',
      now: '2026-05-18T12:00:00',
      timezone: 'Africa/Lagos'
    });

    expect(result.allowed).toBe(false);
    expect(result.warnings.join(' ')).toContain('5 or more');
  });

  it('accepts valid reservations with at least 24 hours notice', () => {
    const result = validateReservation({
      guest_count: 6,
      reservation_date: '2026-06-01',
      reservation_time: '18:00:00',
      now: '2026-05-18T12:00:00',
      timezone: 'Africa/Lagos'
    });

    expect(result.allowed).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });
});
