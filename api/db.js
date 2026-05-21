const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

let pool = null;
let isConnectedToDB = false;

// ============================================================
// IN-MEMORY FALLBACK DATA
// ============================================================
let memoryGuests = [
  {
    id: 1,
    name: "Budi & Susi",
    phone: "6281234567890",
    slug: "budi-susi",
    status: "opened",
    created_at: new Date(Date.now() - 86400000 * 3),
    sent_at: new Date(Date.now() - 86400000 * 2),
    opened_at: new Date(Date.now() - 86400000),
  },
  {
    id: 2,
    name: "Rian Hidayat",
    phone: "6281234567891",
    slug: "rian-hidayat",
    status: "responded",
    created_at: new Date(Date.now() - 86400000 * 5),
    sent_at: new Date(Date.now() - 86400000 * 4),
    opened_at: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 3,
    name: "Ami & Dinda",
    phone: "6281234567892",
    slug: "ami-dinda",
    status: "sent",
    created_at: new Date(Date.now() - 86400000 * 2),
    sent_at: new Date(Date.now() - 86400000),
    opened_at: null,
  },
  {
    id: 4,
    name: "Pak Haji Usman",
    phone: "6281234567893",
    slug: "pak-haji-usman",
    status: "pending",
    created_at: new Date(Date.now() - 86400000),
    sent_at: null,
    opened_at: null,
  },
];

let memoryRsvps = [
  {
    id: 1,
    guest_id: 1,
    name: "Budi & Susi",
    presence: "Hadir",
    guests_count: 2,
    wish: "Barakallahu lakuma wa baaraka 'alaikuma wa jama'a bainakuma fii khair. Selamat menempuh hidup baru Salsa & Rian! Semoga selalu diberkahi kebahagiaan.",
    created_at: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 2,
    guest_id: 2,
    name: "Rian Hidayat",
    presence: "Hadir",
    guests_count: 1,
    wish: "Happy wedding bro Rian! Akhirnya pelaminan juga haha. Semoga langgeng sampai kakek nenek ya!",
    created_at: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: 3,
    guest_id: 3,
    name: "Ami & Dinda",
    presence: "Berhalangan",
    guests_count: 0,
    wish: "Maaf belum bisa hadir karena bertugas di luar kota. Doa tulus kami menyertai pernikahan kalian. Selamat berbahagia!",
    created_at: new Date(Date.now() - 3600000 * 24),
  },
];

let memoryIdCounter = { guests: 5, rsvps: 4 };

// ============================================================
// DATABASE INITIALIZATION
// ============================================================
async function initDB() {
  if (!DATABASE_URL) {
    console.log('[DB] No DATABASE_URL provided. Running with In-Memory store...');
    return;
  }

  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Test connection
    const client = await pool.connect();
    console.log('[DB] Connected to Neon PostgreSQL successfully!');
    client.release();
    isConnectedToDB = true;

    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        sent_at TIMESTAMP,
        opened_at TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        presence VARCHAR(20) NOT NULL,
        guests_count INTEGER DEFAULT 0,
        wish TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('[DB] Tables initialized successfully!');
  } catch (err) {
    console.error('[DB] Connection Error:', err.message);
    console.log('[DB] Falling back to In-Memory store...');
    isConnectedToDB = false;
  }
}

// ============================================================
// HELPER: Generate slug from name
// ============================================================
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Math.random().toString(36).substring(2, 6);
}

// ============================================================
// GUEST OPERATIONS
// ============================================================
async function getAllGuests() {
  if (isConnectedToDB) {
    const result = await pool.query('SELECT * FROM guests ORDER BY created_at DESC');
    return result.rows;
  }
  return [...memoryGuests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function addGuest(name, phone) {
  const slug = generateSlug(name);
  if (isConnectedToDB) {
    const result = await pool.query(
      'INSERT INTO guests (name, phone, slug) VALUES ($1, $2, $3) RETURNING *',
      [name, phone || null, slug]
    );
    return result.rows[0];
  }
  const newGuest = {
    id: memoryIdCounter.guests++,
    name, phone: phone || null, slug,
    status: 'pending',
    created_at: new Date(), sent_at: null, opened_at: null,
  };
  memoryGuests.push(newGuest);
  return newGuest;
}

async function deleteGuest(id) {
  if (isConnectedToDB) {
    await pool.query('DELETE FROM rsvps WHERE guest_id = $1', [id]);
    const result = await pool.query('DELETE FROM guests WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
  memoryRsvps = memoryRsvps.filter(r => r.guest_id !== id);
  const idx = memoryGuests.findIndex(g => g.id === id);
  if (idx === -1) return null;
  return memoryGuests.splice(idx, 1)[0];
}

async function updateGuestStatus(id, status, extraFields = {}) {
  if (isConnectedToDB) {
    let setClauses = ['status = $2'];
    let params = [id, status];
    let paramIdx = 3;
    for (const [key, val] of Object.entries(extraFields)) {
      setClauses.push(`${key} = $${paramIdx}`);
      params.push(val);
      paramIdx++;
    }
    const result = await pool.query(
      `UPDATE guests SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    return result.rows[0];
  }
  const guest = memoryGuests.find(g => g.id === id);
  if (!guest) return null;
  guest.status = status;
  Object.assign(guest, extraFields);
  return guest;
}

async function getGuestBySlug(slug) {
  if (isConnectedToDB) {
    const result = await pool.query('SELECT * FROM guests WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  }
  return memoryGuests.find(g => g.slug === slug) || null;
}

async function getGuestById(id) {
  if (isConnectedToDB) {
    const result = await pool.query('SELECT * FROM guests WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
  return memoryGuests.find(g => g.id === id) || null;
}

// ============================================================
// RSVP OPERATIONS
// ============================================================
async function getAllRsvps() {
  if (isConnectedToDB) {
    const result = await pool.query('SELECT * FROM rsvps ORDER BY created_at DESC');
    return result.rows;
  }
  return [...memoryRsvps].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function addRsvp(guestId, name, presence, guestsCount, wish) {
  if (isConnectedToDB) {
    const result = await pool.query(
      'INSERT INTO rsvps (guest_id, name, presence, guests_count, wish) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [guestId || null, name, presence, guestsCount, wish]
    );
    return result.rows[0];
  }
  const newRsvp = {
    id: memoryIdCounter.rsvps++,
    guest_id: guestId || null,
    name, presence, guests_count: guestsCount, wish,
    created_at: new Date(),
  };
  memoryRsvps.push(newRsvp);
  return newRsvp;
}

// ============================================================
// STATS
// ============================================================
async function getDashboardStats() {
  const guests = await getAllGuests();
  const rsvps = await getAllRsvps();

  const totalGuests = guests.length;
  const sent = guests.filter(g => ['sent', 'opened', 'responded'].includes(g.status)).length;
  const opened = guests.filter(g => ['opened', 'responded'].includes(g.status)).length;
  const responded = guests.filter(g => g.status === 'responded').length;
  const pending = guests.filter(g => g.status === 'pending').length;

  const hadir = rsvps.filter(r => r.presence === 'Hadir');
  const berhalangan = rsvps.filter(r => r.presence === 'Berhalangan');
  const totalPax = hadir.reduce((sum, r) => sum + (r.guests_count || 0), 0);

  return {
    totalGuests,
    sent,
    opened,
    responded,
    pending,
    totalHadir: hadir.length,
    totalBerhalangan: berhalangan.length,
    totalPax,
    totalWishes: rsvps.length,
  };
}

module.exports = {
  initDB,
  generateSlug,
  getAllGuests,
  addGuest,
  deleteGuest,
  updateGuestStatus,
  getGuestBySlug,
  getGuestById,
  getAllRsvps,
  addRsvp,
  getDashboardStats,
  isConnected: () => isConnectedToDB,
};
