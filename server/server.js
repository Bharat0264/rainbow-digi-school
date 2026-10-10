// Legacy SQLite reader. Public enquiries use the Vercel api/enquiries.ts handler.
// Existing school.db is preserved; this service never seeds or deletes records.
import express from 'express';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const app = express();
const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'school.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, error => {
  if (error) console.error('legacy_database_unavailable');
});
app.disable('x-powered-by');
app.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});
app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'Legacy read-only API' }));
app.post(['/api/enquiry', '/api/enquiries'], (_request, response) => {
  response.status(410).json({ error: 'This legacy enquiry endpoint is retired. Use the deployed school website enquiry form.' });
});
function requireAdmin(request, response, next) {
  const expected = process.env.LEGACY_ADMIN_TOKEN;
  const provided = request.get('Authorization')?.replace(/^Bearer /, '');
  if (!expected || expected.length < 32 || !provided || Buffer.byteLength(expected) !== Buffer.byteLength(provided) || !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) {
    return response.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
app.get('/api/admin/enquiries', requireAdmin, (_request, response) => {
  db.all('SELECT * FROM enquiries ORDER BY createdAt DESC', [], (error, rows) => {
    if (error) return response.status(503).json({ error: 'Records unavailable' });
    return response.json(rows);
  });
});
// Historical events require the same review as other school-owned records.
app.get('/api/events', requireAdmin, (_request, response) => {
  db.all('SELECT * FROM events', [], (error, rows) => {
    if (error) return response.status(503).json({ error: 'Records unavailable' });
    return response.json(rows);
  });
});
app.listen(process.env.PORT || 3001, '127.0.0.1', () => console.log('Legacy read-only API listening on loopback'));
