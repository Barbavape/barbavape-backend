const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const HIBOUTIK_ACCOUNT = "barbavape";
const HIBOUTIK_BASE = `https://${HIBOUTIK_ACCOUNT}.hiboutik.com/api`;
const API_USER = process.env.HIBOUTIK_USER;
const API_KEY = process.env.HIBOUTIK_KEY;

const STORE_MAP = { 1: "chateau", 2: "ecommoy" };

app.use(cors());
app.use(express.json());

const getHeaders = () => ({
  Authorization: "Basic " + Buffer.from(`${API_USER}:${API_KEY}`).toString("base64"),
  Accept: "application/json",
  "Content-Type": "application/json",
});

async function hiboutikGet(path) {
  try {
    const res = await fetch(`${HIBOUTIK_BASE}${path}`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Hiboutik GET ${path} -> ${res.status}`);
    return res.json();
  } catch (e) {
    console.error(`hiboutikGet error on ${path}:`, e.message);
    throw e;
  }
}

async function hiboutikGetAll(path) {
  let results = [], page = 1, hasMore = true;
  while (hasMore) {
    const sep = path.includes("?") ? "&" : "?";
    const data = await hiboutikGet(`${path}${sep}p=${page}`);
    if (!Array.isArray(data) || data.length === 0) { hasMore = false; break; }
    results = results.concat(data);
    hasMore = data.length === 250;
    page++;
  }
  return results;
}

// --- SANTE ---
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Barbavape API" });
});

// --- DIAGNOSTIC ---
app.get("/api/test-hiboutik", async (req, res) => {
  try {
    const url = `${HIBOUTIK_BASE}/customers/`;
    const response = await fetch(url, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(15000),
    });
    const text = await response.text();
    res.json({
      status: response.status,
      ok: response.ok,
      user_set: !!API_USER,
      key_set: !!API_KEY,
      hiboutik_url: url,
      raw_response: text.substring(0, 500),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- CLIENTS (sans ventes — chargement rapide) ---
app.get("/api/clients", async (req, res) => {
  try {
    const customers = await hiboutikGetAll("/customers/");
    const clients = customers.map((c) => ({
      id: c.customers_id,
      name: `${c.first_name} ${c.last_name}`.trim(),
      phone: c.phone || "",
      email: c.email || "",
      messenger: "",
      preferredChannel: "sms",
      store: "chateau",
      points: Math.floor(parseFloat(c.turnover || 0)),
      welcomeGiven: parseFloat(c.turnover || 0) > 0,
      purchases: [],
      preferences: [],
      cigsBefore: 0,
      cigsNow: 0,
      quitDate: "",
      prixPaquet: 11,
    }));
    res.json(clients);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// --- VENTES D'UN CLIENT (chargées à la demande) ---
app.get("/api/clients/:id/sales", async (req, res) => {
  try {
    const sales = await hiboutikGetAll(`/sales/?customer_id=${req.params.id}`);
    const purchases = sales.map((s) => ({
      date: s.completed_at ? s.completed_at.substring(0, 10) : (s.sale_date || "").substring(0, 10),
      amount: parseFloat(s.amount_with_tax || 0),
      product: `Vente #${s.sale_id}`,
      store: STORE_MAP[s.store_id] || "chateau",
    }));
    res.json(purchases);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- WEBHOOK VENTE ---
app.post("/api/webhook/sale", async (req, res) => {
  try {
    const { sale_id } = req.body;
    if (!sale_id) return res.status(400).json({ error: "sale_id manquant" });
    console.log(`Vente recue : #${sale_id}`);
    res.status(200).json({ received: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Barbavape API demarree sur le port ${PORT}`);
});
