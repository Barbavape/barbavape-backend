const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const HIBOUTIK_ACCOUNT = "barbavape";
const HIBOUTIK_BASE = `https://${HIBOUTIK_ACCOUNT}.hiboutik.com/api`;
const API_USER = process.env.HIBOUTIK_USER;
const API_KEY = process.env.HIBOUTIK_KEY;

const STORE_MAP = {
  1: "chateau",
  2: "ecommoy",
};

app.use(cors());
app.use(express.json());

const getHeaders = () => ({
  Authorization: "Basic " + Buffer.from(`${API_USER}:${API_KEY}`).toString("base64"),
  Accept: "application/json",
  "Content-Type": "application/json",
});

async function hiboutikGet(path) {
  const res = await fetch(`${HIBOUTIK_BASE}${path}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Hiboutik GET ${path} -> ${res.status}`);
  return res.json();
}

async function hiboutikPut(path, body) {
  const res = await fetch(`${HIBOUTIK_BASE}${path}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Hiboutik PUT ${path} -> ${res.status}`);
  return res.json();
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

app.get("/", (req, res) => res.json({ status: "ok", service: "Barbavape API" }));

app.get("/api/clients", async (req, res) => {
  try {
    const customers = await hiboutikGetAll("/customers/");
    const enriched = await Promise.all(customers.map(async (c) => {
      try {
        const sales = await hiboutikGetAll(`/sales/?customer_id=${c.customers_id}`);
        const purchases = sales.map((s) => ({
          saleId: s.sale_id,
          date: s.completed_at || s.sale_date,
          amount: parseFloat(s.amount_with_tax || 0),
          storeId: s.store_id,
        }));
        const points = Math.floor(purchases.reduce((sum, p) => sum + p.amount, 0));
        const storeCounts = {};
        purchases.forEach(p => {
          const key = STORE_MAP[p.storeId] || "chateau";
          storeCounts[key] = (storeCounts[key] || 0) + 1;
        });
        const mainStore = Object.entries(storeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "chateau";
        return {
          id: c.customers_id,
          name: `${c.customers_first_name} ${c.customers_last_name}`.trim(),
          phone: c.customers_phone_number || "",
          email: c.customers_email || "",
          messenger: c.customers_note || "",
          preferredChannel: c.customers_second_phone || "sms",
          store: mainStore,
          points,
          welcomeGiven: points > 0,
          purchases: purchases.map(p => ({
            date: p.date ? p.date.substring(0, 10) : "",
            amount: p.amount,
            product: `Vente #${p.saleId}`,
            storeId: p.storeId,
          })),
          preferences: [],
          cigsBefore: 0,
          cigsNow: 0,
          quitDate: "",
          prixPaquet: 11,
        };
      } catch {
        return null;
      }
    }));
    res.json(enriched.filter(Boolean));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/clients/:id", async (req, res) => {
  try {
    const c = await hiboutikGet(`/customer/${req.params.id}`);
    res.json(c);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/clients/:id/sales", async (req, res) => {
  try {
    const sales = await hiboutikGetAll(`/sales/?customer_id=${req.params.id}`);
    const detailed = await Promise.all(sales.map(async (s) => {
      try {
        const items = await hiboutikGet(`/products_sold/?sale_id=${s.sale_id}`);
        return {
          saleId: s.sale_id,
          date: s.completed_at || s.sale_date,
          amount: parseFloat(s.amount_with_tax || 0),
          store: STORE_MAP[s.store_id] || "chateau",
          items: Array.isArray(items) ? items.map(i => ({
            product: i.product_display_name || i.product_id,
            quantity: i.quantity,
            price: parseFloat(i.product_price || 0),
          })) : [],
        };
      } catch {
        return { saleId: s.sale_id, date: s.completed_at, amount: parseFloat(s.amount_with_tax || 0) };
      }
    }));
    res.json(detailed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/clients/:id/channel", async (req, res) => {
  try {
    const { channel } = req.body;
    await hiboutikPut(`/customer/${req.params.id}/`, {
      customers_second_phone: channel,
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/webhook/sale", async (req, res) => {
  try {
    const { sale_id } = req.body;
    if (!sale_id) return res.status(400).json({ error: "sale_id manquant" });
    const sale = await hiboutikGet(`/sales/${sale_id}`);
    console.log(`Vente recue : #${sale_id} - Client ${sale.customer_id} - ${sale.amount_with_tax}EUR`);
    res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Barbavape API demarree sur le port ${PORT}`);
  console.log(`Hiboutik : ${HIBOUTIK_BASE}`);
});
