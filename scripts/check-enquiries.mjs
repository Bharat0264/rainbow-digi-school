// Synthetic fixtures only. Persistence is mocked; no database or messaging calls.
import assert from 'node:assert/strict';
import { createHandler, enquirySchema, isAllowedOrigin } from '../api/enquiries.ts';

const valid = { parentName: 'Test Parent', phone: '9000000000', email: '', program: 'Nursery', message: '', consent: true, website: '' };
const previousOrigins = process.env.ALLOWED_ORIGINS;
const previousDatabase = process.env.DATABASE_URL;
let writes = 0;
let checks = 0;
const handler = createHandler(async data => { writes++; assert.equal(data.parentName, 'Test Parent'); return { enquiryNumber: 'RDS-ENQ-2026-0123456789' }; });
async function request(body = valid, overrides = {}, action = handler) {
  const result = { statusCode: 0, body: null, headers: {} };
  const response = { setHeader(name, value) { result.headers[name] = value; }, status(code) { result.statusCode = code; return this; }, json(body) { result.body = body; return this; } };
  await action({ method: 'POST', headers: { origin: 'https://school.example', 'content-type': 'application/json' }, body, ...overrides }, response);
  checks++;
  return result;
}
try {
  process.env.ALLOWED_ORIGINS = 'https://school.example';
  process.env.DATABASE_URL = 'mock-only';
  assert.equal((await request()).statusCode, 201);
  assert.equal(writes, 1);
  for (const patch of [{ consent: false }, { phone: '1234567890' }, { program: 'Grade 12' }, { parentName: ' ' }, { website: 'bot' }, { message: 'x'.repeat(1001) }, { email: 'invalid' }]) assert.equal((await request({ ...valid, ...patch })).statusCode, 422);
  assert.equal(writes, 1);
  assert.equal((await request(valid, { method: 'GET' })).statusCode, 405);
  assert.equal((await request(valid, { headers: { origin: 'https://other.example' } })).statusCode, 403);
  assert.equal((await request(valid, { headers: { origin: 'https://school.example', 'content-type': 'text/plain' } })).statusCode, 415);
  assert.equal((await request({ ...valid, message: 'x'.repeat(13000) })).statusCode, 413);
  delete process.env.DATABASE_URL;
  assert.equal((await request()).statusCode, 503);
  process.env.DATABASE_URL = 'mock-only';
  assert.equal((await request(valid, {}, createHandler(async () => { throw new Error('Synthetic persistence failure'); }))).statusCode, 503);
  delete process.env.ALLOWED_ORIGINS;
  assert.equal(isAllowedOrigin('https://school.example'), false);
  assert.equal(isAllowedOrigin(undefined), false);
  assert.equal(enquirySchema.safeParse({ ...valid, phone: '+91 90000 00000' }).success, true);
  console.log(`${checks} enquiry handler scenarios passed; origin and phone checks passed. All persistence mocked.`);
} finally {
  if (previousOrigins === undefined) delete process.env.ALLOWED_ORIGINS; else process.env.ALLOWED_ORIGINS = previousOrigins;
  if (previousDatabase === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = previousDatabase;
}
