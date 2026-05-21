const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// In-Memory Database Fallback (untuk testing lokal / default state)
let memoryRsvps = [
  {
    _id: "1",
    name: "Budi & Susi",
    presence: "Hadir",
    guests: 2,
    wish: "Barakallahu lakuma wa baaraka 'alaikuma wa jama'a bainakuma fii khair. Selamat menempuh hidup baru Salsa & Rian! Semoga selalu diberkahi kebahagiaan, rezeki melimpah, dan keturunan yang sholeh/sholehah.",
    createdAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    _id: "2",
    name: "Rian Hidayat",
    presence: "Hadir",
    guests: 1,
    wish: "Happy wedding bro Rian! Akhirnya pelaminan juga haha. Semoga dilancarkan semua acaranya hari ini dan langgeng terus sampai kakek nenek ya!",
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: "3",
    name: "Ami & Dinda",
    presence: "Berhalangan",
    guests: 0,
    wish: "Maaf ya Salsa & Rian belum bisa hadir secara langsung karena sedang bertugas di luar kota. Namun doa tulus kami selalu menyertai pernikahan kalian. Selamat berbahagia!",
    createdAt: new Date(Date.now() - 3600000 * 24)
  }
];

let isConnectedToMongo = false;

// Koneksi Mongoose (jika MONGODB_URI disediakan di env)
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB Connected Successfully');
      isConnectedToMongo = true;
    })
    .catch((err) => {
      console.error('MongoDB Connection Error:', err.message);
      console.log('Falling back to In-Memory store...');
    });
} else {
  console.log('No MONGODB_URI provided. Running with In-Memory store...');
}

// Mongoose Schema & Model
const RSVP_Schema = new mongoose.Schema({
  name: { type: String, required: true },
  presence: { type: String, required: true, enum: ['Hadir', 'Berhalangan'] },
  guests: { type: Number, default: 0 },
  wish: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const RSVP = mongoose.models.RSVP || mongoose.model('RSVP', RSVP_Schema);

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: isConnectedToMongo ? 'MongoDB' : 'In-Memory',
    message: 'Wedding Invitation API is running!'
  });
});

// GET all wishes/RSVPs
app.get('/api/wishes', async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const data = await RSVP.find().sort({ createdAt: -1 });
      res.json(data);
    } else {
      // Urutkan memori dari terbaru
      const data = [...memoryRsvps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new RSVP/wish
app.post('/api/rsvp', async (req, res) => {
  try {
    const { name, presence, guests, wish } = req.body;
    
    if (!name || !presence || !wish) {
      return res.status(400).json({ error: 'Mohon lengkapi nama, status kehadiran, dan ucapan Anda!' });
    }

    const guestCount = presence === 'Hadir' ? parseInt(guests) || 1 : 0;

    if (isConnectedToMongo) {
      const newRSVP = new RSVP({
        name,
        presence,
        guests: guestCount,
        wish
      });
      await newRSVP.save();
      res.status(201).json(newRSVP);
    } else {
      const newRSVP = {
        _id: Math.random().toString(36).substring(2, 11),
        name,
        presence,
        guests: guestCount,
        wish,
        createdAt: new Date()
      };
      memoryRsvps.push(newRSVP);
      res.status(201).json(newRSVP);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan server lokal jika dieksekusi langsung
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// Export aplikasi untuk Vercel Serverless Function
module.exports = app;
