import { DateTime } from 'luxon';
import { knowledgeBase } from './knowledgeBase.js';

export interface DeliveryValidationInput {
  fulfillment_type?: string;
  delivery_area?: string;
  order_total?: number;
  requested_at?: string;
  timezone?: string;
}

export interface DeliveryValidationResult {
  allowed: boolean;
  fee?: number;
  warnings: string[];
}

export interface ReservationValidationInput {
  guest_count?: number;
  reservation_date?: string;
  reservation_time?: string;
  now?: string;
  timezone?: string;
}

export interface ReservationValidationResult {
  allowed: boolean;
  warnings: string[];
}

export function normalizeArea(area: string): string {
  return area.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stripTrailingSentencePunctuation(value: string | undefined): string {
  return (value || 'not provided').trim().replace(/[.!?]+$/g, '');
}

export function getDeliveryFee(area: string): number | undefined {
  const normalizedArea = normalizeArea(area);
  const match = knowledgeBase.delivery.areas.find((group) => (group.names as readonly string[]).includes(normalizedArea));
  return match?.fee;
}

export function validateDelivery(input: DeliveryValidationInput): DeliveryValidationResult {
  const warnings: string[] = [];

  if (input.fulfillment_type !== 'delivery') {
    return { allowed: true, warnings };
  }

  const timezone = input.timezone ?? 'Africa/Lagos';
  const requestedAt = input.requested_at
    ? DateTime.fromISO(input.requested_at, { zone: timezone })
    : DateTime.now().setZone(timezone);

  if (!requestedAt.isValid) {
    warnings.push('Delivery date/time could not be validated. Staff should verify manually.');
  } else {
    if (requestedAt.weekday === 7) {
      warnings.push('Delivery is not available on Sundays. Offer pickup or walk-in instead.');
    }

    const hour = requestedAt.hour + requestedAt.minute / 60;
    if (hour < 10 || hour >= 19) {
      warnings.push('Delivery is only available from 10:00am to 7:00pm, Monday to Saturday.');
    }
  }

  if (!input.order_total || input.order_total < knowledgeBase.delivery.minimumOrder) {
    warnings.push('Minimum delivery order is ₦3,000.');
  }

  const fee = input.delivery_area ? getDeliveryFee(input.delivery_area) : undefined;
  if (!input.delivery_area) {
    warnings.push('Delivery area is required for delivery orders.');
  } else if (fee === undefined) {
    warnings.push(`Delivery area "${input.delivery_area}" is not in the supported delivery list. Staff should confirm manually.`);
  }

  return {
    allowed: warnings.length === 0,
    fee,
    warnings
  };
}

export function validateReservation(input: ReservationValidationInput): ReservationValidationResult {
  const warnings: string[] = [];
  const timezone = input.timezone ?? 'Africa/Lagos';
  const now = input.now ? DateTime.fromISO(input.now, { zone: timezone }) : DateTime.now().setZone(timezone);

  if (!input.guest_count || input.guest_count < knowledgeBase.reservations.minimumGuests) {
    warnings.push('Reservations are only accepted for groups of 5 or more. Fewer than 5 guests should be treated as walk-in.');
  }

  if (!input.reservation_date || !input.reservation_time) {
    warnings.push('Reservation date and time are required.');
  } else {
    const requested = DateTime.fromISO(`${input.reservation_date}T${input.reservation_time}`, { zone: timezone });
    if (!requested.isValid) {
      warnings.push('Reservation date/time could not be parsed. Staff should verify manually.');
    } else if (requested.diff(now, 'hours').hours < knowledgeBase.reservations.advanceNoticeHours) {
      warnings.push('Reservations must be made at least 24 hours in advance.');
    }
  }

  return {
    allowed: warnings.length === 0,
    warnings
  };
}

export function buildConfirmationSummary(input: {
  request_type: string;
  customer_name: string;
  phone_number: string;
  order_details?: string;
  fulfillment_type?: string;
  delivery_area?: string;
  delivery_fee?: number;
  reservation_date?: string;
  reservation_time?: string;
  guest_count?: number;
  callback_reason?: string;
}): string {
  if (input.request_type === 'order') {
    const deliveryText = input.fulfillment_type === 'delivery'
      ? ` Delivery area: ${input.delivery_area || 'not provided'}. Delivery fee: ₦${input.delivery_fee ?? 0}.`
      : ` Fulfillment: ${input.fulfillment_type || 'not specified'}.`;
    return `Order for ${input.customer_name}, phone ${input.phone_number}. Items: ${stripTrailingSentencePunctuation(input.order_details)}.${deliveryText}`;
  }

  if (input.request_type === 'reservation') {
    return `Reservation for ${input.customer_name}, phone ${input.phone_number}, ${input.guest_count ?? 0} guests, on ${input.reservation_date || 'date not provided'} at ${input.reservation_time || 'time not provided'}.`;
  }

  if (input.request_type === 'callback') {
    return `Callback request for ${input.customer_name}, phone ${input.phone_number}. Reason: ${stripTrailingSentencePunctuation(input.callback_reason)}.`;
  }

  return `${input.request_type} request for ${input.customer_name}, phone ${input.phone_number}.`;
}
