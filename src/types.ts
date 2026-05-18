import { z } from 'zod';

export const requestTypeSchema = z.enum([
  'order',
  'reservation',
  'callback',
  'complaint',
  'catering',
  'general_inquiry'
]);

export const statusSchema = z.enum(['new', 'reviewed', 'confirmed', 'completed', 'cancelled']);

export const callLogSchema = z.object({
  request_type: requestTypeSchema,
  customer_name: z.string().trim().min(1).max(120),
  phone_number: z.string().trim().min(5).max(40),
  order_details: z.string().trim().max(2000).optional().default(''),
  order_total: z.number().nonnegative().optional(),
  fulfillment_type: z.enum(['pickup', 'delivery', 'walk_in', 'not_applicable']).optional().default('not_applicable'),
  delivery_address: z.string().trim().max(500).optional().default(''),
  delivery_area: z.string().trim().max(120).optional().default(''),
  delivery_fee: z.number().nonnegative().optional(),
  reservation_date: z.string().trim().max(40).optional().default(''),
  reservation_time: z.string().trim().max(40).optional().default(''),
  guest_count: z.number().int().nonnegative().optional(),
  callback_reason: z.string().trim().max(1000).optional().default(''),
  notes: z.string().trim().max(2000).optional().default(''),
  confirmation_summary: z.string().trim().max(2000).optional().default(''),
  status: statusSchema.optional().default('new'),
  source: z.string().trim().max(120).optional().default('voice_agent'),
  call_id: z.string().trim().max(120).optional().default(''),
  raw_transcript: z.string().trim().max(10000).optional().default('')
});

export type CallLogRequest = z.infer<typeof callLogSchema>;

export interface CallLogRecord extends CallLogRequest {
  id: string;
  timestamp: string;
  validation_warnings: string[];
}

export interface LogSink {
  append(record: CallLogRecord): Promise<void>;
}
