import { describe, expect, it, beforeEach } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.WEBHOOK_SECRET = 'test-secret-123456';
process.env.LOG_DESTINATION = 'local_jsonl';
process.env.LOCAL_LOG_PATH = 'storage/test-call-logs.jsonl';

const { createApp } = await import('../src/app.js');

describe('API', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('returns health status', async () => {
    const response = await request(app).get('/healthz');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('rejects missing webhook secret', async () => {
    const response = await request(app).post('/api/call-logs').send({});
    expect(response.status).toBe(401);
  });

  it('logs a valid callback request', async () => {
    const response = await request(app)
      .post('/api/call-logs')
      .set('X-Webhook-Secret', 'test-secret-123456')
      .send({
        request_type: 'callback',
        customer_name: 'Aisha Bello',
        phone_number: '08123450000',
        callback_reason: 'Needs a staff callback for catering quote.'
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('logged');
  });
});
