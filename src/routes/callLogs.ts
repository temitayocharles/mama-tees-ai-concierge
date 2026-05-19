import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { config, isWebhookSecretConfigured } from '../config.js';
import { logger } from '../logger.js';
import { validateDelivery, validateReservation, buildConfirmationSummary } from '../domain/businessRules.js';
import { knowledgeBase } from '../domain/knowledgeBase.js';
import { callLogSchema, type CallLogRecord, type LogSink } from '../types.js';

export function createCallLogsRouter(logSink: LogSink): Router {
  const router = Router();

  router.get('/api/knowledge-base', (_req, res) => {
    res.status(200).json(knowledgeBase);
  });

  router.post('/api/call-logs', async (req, res) => {
    if (!isWebhookSecretConfigured()) {
      logger.error('WEBHOOK_SECRET is not configured; refusing call-log writes');
      return res.status(503).json({ error: 'Webhook authentication is not configured' });
    }

    const providedSecret = req.header('X-Webhook-Secret');
    if (!providedSecret || providedSecret !== config.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parseResult = callLogSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid call log payload',
        details: parseResult.error.flatten()
      });
    }

    const payload = parseResult.data;
    const validationWarnings: string[] = [];

    const deliveryValidation = validateDelivery({
      fulfillment_type: payload.fulfillment_type,
      delivery_area: payload.delivery_area,
      order_total: payload.order_total,
      timezone: config.BUSINESS_TIMEZONE
    });
    validationWarnings.push(...deliveryValidation.warnings);

    const reservationValidation = validateReservation({
      guest_count: payload.guest_count,
      reservation_date: payload.reservation_date,
      reservation_time: payload.reservation_time,
      timezone: config.BUSINESS_TIMEZONE
    });
    if (payload.request_type === 'reservation') {
      validationWarnings.push(...reservationValidation.warnings);
    }

    const deliveryFee = payload.delivery_fee ?? deliveryValidation.fee;
    const confirmationSummary = payload.confirmation_summary || buildConfirmationSummary({
      ...payload,
      delivery_fee: deliveryFee
    });

    const record: CallLogRecord = {
      ...payload,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      delivery_fee: deliveryFee,
      confirmation_summary: confirmationSummary,
      validation_warnings: validationWarnings
    };

    try {
      await logSink.append(record);
      return res.status(201).json({
        status: 'logged',
        id: record.id,
        validation_warnings: validationWarnings,
        confirmation_summary: confirmationSummary
      });
    } catch (error) {
      logger.error({ error }, 'Failed to append call log');
      return res.status(500).json({ error: 'Failed to append call log' });
    }
  });

  return router;
}
