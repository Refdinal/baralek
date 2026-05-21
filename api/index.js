const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize database connection
await db.initDB();

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: db.isConnected() ? "Neon PostgreSQL" : "In-Memory",
    message: "Wedding Invitation API is running!",
  });
});

// GET dashboard statistics
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all guests
app.get("/api/guests", async (req, res) => {
  try {
    const guests = await db.getAllGuests();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET guest by slug
app.get("/api/guests/:slug", async (req, res) => {
  try {
    const guest = await db.getGuestBySlug(req.params.slug);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new guest
app.post("/api/guests", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nama tamu wajib diisi" });
    }

    const guest = await db.addGuest(name, phone);
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE guest
app.delete("/api/guests/:id", async (req, res) => {
  try {
    const guest = await db.deleteGuest(parseInt(req.params.id));
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json({ message: "Guest deleted successfully", guest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE guest status
app.patch("/api/guests/:id/status", async (req, res) => {
  try {
    const { status, sent_at, opened_at } = req.body;
    const extraFields = {};

    if (sent_at) extraFields.sent_at = sent_at;
    if (opened_at) extraFields.opened_at = opened_at;

    const guest = await db.updateGuestStatus(parseInt(req.params.id), status, extraFields);
    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all RSVPs
app.get("/api/rsvps", async (req, res) => {
  try {
    const rsvps = await db.getAllRsvps();
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new RSVP/wish
app.post("/api/rsvp", async (req, res) => {
  try {
    const { guest_id, name, presence, guests_count, wish } = req.body;

    if (!name || !presence || !wish) {
      return res.status(400).json({ error: "Mohon lengkapi nama, status kehadiran, dan ucapan Anda!" });
    }

    const rsvp = await db.addRsvp(guest_id, name, presence, guests_count, wish);
    res.status(201).json(rsvp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan server lokal jika dieksekusi langsung
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// Export aplikasi untuk Vercel Serverless Function
module.exports = app;
