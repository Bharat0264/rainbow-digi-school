import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'school.db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sanitization helper
const sanitizeInput = (val) => {
  if (typeof val !== 'string') return val;
  return val.trim().replace(/[<>]/g, '');
};

// Rate Limiter for Enquiries
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this IP, please try again after 15 minutes.' },
});

// Database Setup
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
    db.serialize(() => {
      // Create Enquiries table
      db.run(`CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parentName TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        classApplying TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Events table
      db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        tag TEXT NOT NULL,
        description TEXT NOT NULL
      )`, (err) => {
        if (!err) {
          // Pre-fill events if empty
          db.get("SELECT COUNT(*) as count FROM events", (err, row) => {
            if (row && row.count === 0) {
              const stmt = db.prepare("INSERT INTO events (title, date, tag, description) VALUES (?, ?, ?, ?)");
              const initialEvents = [
                { title: "Annual Science & Innovation Expo", date: "November 15, 2026", tag: "Academic", description: "Students showcase projects spanning robotics, environmental science, and digital innovation." },
                { title: "Rainbow Sports Championship", date: "December 8, 2026", tag: "Sports", description: "Inter-house athletics, team games, and individual events celebrating sportsmanship." },
                { title: "Cultural Fest – Colours of Joy", date: "January 20, 2027", tag: "Cultural", description: "Dance, drama, music performances, and art exhibitions by every grade." },
                { title: "Parent-Teacher Connect", date: "February 5, 2027", tag: "Community", description: "Collaborative sessions for academic reviews, feedback, and growth planning." },
                { title: "Admissions Open House", date: "March 1, 2027", tag: "Admissions", description: "Campus tours, meet the faculty, and experience smart classrooms first-hand." },
                { title: "Graduation & Awards Ceremony", date: "April 10, 2027", tag: "Celebration", description: "Honouring academic excellence, character awards, and fond farewells." }
              ];
              initialEvents.forEach(e => stmt.run(e.title, e.date, e.tag, e.description));
              stmt.finalize();
              console.log("Pre-filled events table with initial events.");
            }
          });
        }
      });
    });
  }
});

// Zod Schema for Validation
const enquirySchema = z.object({
  parentName: z.string().min(2, "Parent name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Valid phone number with at least 10 digits required").max(20),
  email: z.string().email("Invalid email address"),
  classApplying: z.string().min(1, "Please select a grade/class"),
  message: z.string().min(10, "Message must be at least 10 characters long").max(1000),
});

// Routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Rainbow Digi School API', timestamp: new Date().toISOString() });
});

// POST /api/enquiry
app.post('/api/enquiry', enquiryLimiter, (req, res) => {
  try {
    const rawData = {
      parentName: sanitizeInput(req.body.parentName),
      phone: sanitizeInput(req.body.phone),
      email: sanitizeInput(req.body.email),
      classApplying: sanitizeInput(req.body.classApplying),
      message: sanitizeInput(req.body.message),
    };

    const validatedData = enquirySchema.parse(rawData);
    const { parentName, phone, email, classApplying, message } = validatedData;

    // Save to DB
    const stmt = db.prepare(`INSERT INTO enquiries (parentName, phone, email, classApplying, message) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([parentName, phone, email, classApplying, message], function(err) {
      if (err) {
        console.error("DB Error saving enquiry:", err);
        return res.status(500).json({ error: "Failed to save enquiry" });
      }

      // Mock Email and WhatsApp notifications
      console.log(`\n========================================`);
      console.log(`📧 [MOCK EMAIL NOTIFICATION]`);
      console.log(`To: admissions@rainbowdigischool.com`);
      console.log(`Subject: New Admission Enquiry - ${parentName}`);
      console.log(`Body: Parent: ${parentName} | Phone: ${phone} | Email: ${email} | Class: ${classApplying}\nMessage: "${message}"`);
      console.log(`----------------------------------------`);
      console.log(`💬 [MOCK WHATSAPP NOTIFICATION]`);
      console.log(`To Admin (+918008533078): New enquiry from ${parentName} (${phone}) for ${classApplying}.`);
      console.log(`========================================\n`);

      return res.status(201).json({
        success: true,
        message: "Enquiry submitted successfully",
        id: this.lastID
      });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message, details: error.errors });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/events
app.get('/api/events', (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch events" });
    }
    res.json(rows);
  });
});

// GET /api/admin/enquiries
app.get('/api/admin/enquiries', (req, res) => {
  db.all("SELECT * FROM enquiries ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch enquiries" });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
