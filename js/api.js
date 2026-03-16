// ─────────────────────────────────────────────
// REPLACE with your Alpha Vantage API key.
// Free key at: https://www.alphavantage.co/support/#api-key
// ─────────────────────────────────────────────
const API_KEY = "UWPC6DS4HSUOC6IV";
const BASE = "https://www.alphavantage.co/query";

// Cache to avoid hitting rate limits (5 calls/min on free tier)
const cache = {};
function cached(key, fn, ttl = 60000) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < ttl) return Promise.resolve(cache[key].data);
  return fn().then(data => { cache[key] = { data, ts: now }; return data; });
}

// ── Get real-time quote for a symbol ──
export async function getQuote(symbol) {
  return cached(`quote_${symbol}`, async () => {
    const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    const q = json["Global Quote"];
    if (!q || !q["05. price"]) return getMockQuote(symbol);
    return {
      symbol: q["01. symbol"],
      price: parseFloat(q["05. price"]).toFixed(2),
      change: parseFloat(q["09. change"]).toFixed(2),
      changePct: parseFloat(q["10. change percent"]).toFixed(2),
      open: parseFloat(q["02. open"]).toFixed(2),
      high: parseFloat(q["03. high"]).toFixed(2),
      low: parseFloat(q["04. low"]).toFixed(2),
      volume: parseInt(q["06. volume"]).toLocaleString()
    };
  });
}

// ── Get daily time series for chart ──
export async function getTimeSeries(symbol, interval = "DAILY") {
  return cached(`ts_${symbol}_${interval}`, async () => {
    const fn = interval === "INTRADAY"
      ? `TIME_SERIES_INTRADAY&interval=60min`
      : `TIME_SERIES_${interval}`;
    const url = `${BASE}?function=${fn}&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    const key = Object.keys(json).find(k => k.includes("Time Series"));
    if (!key) return getMockTimeSeries(symbol);

    const series = json[key];
    const dates = Object.keys(series).slice(0, 30).reverse();
    return dates.map(date => ({
      date,
      open: parseFloat(series[date]["1. open"]),
      high: parseFloat(series[date]["2. high"]),
      low: parseFloat(series[date]["3. low"]),
      close: parseFloat(series[date]["4. close"]),
      volume: parseInt(series[date]["5. volume"])
    }));
  }, 300000);
}

// ── Search symbols ──
export async function searchSymbol(query) {
  const url = `${BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  const matches = json["bestMatches"] || [];
  return matches.slice(0, 6).map(m => ({
    symbol: m["1. symbol"],
    name: m["2. name"],
    type: m["3. type"],
    region: m["4. region"]
  }));
}

// ── Mock fallbacks (used when API limit hit or during dev) ──
export function getMockQuote(symbol) {
  const prices = { AAPL:189.30, MSFT:415.10, TSLA:248.50, NVDA:875.20, GOOGL:174.90, AMZN:192.50, META:530.80, NFLX:645.20 };
  const base = prices[symbol] || 100 + Math.random() * 200;
  const change = (Math.random() - 0.48) * 6;
  return {
    symbol, price: base.toFixed(2),
    change: change.toFixed(2),
    changePct: ((change / base) * 100).toFixed(2),
    open: (base - 1).toFixed(2),
    high: (base + Math.random() * 3).toFixed(2),
    low: (base - Math.random() * 3).toFixed(2),
    volume: Math.floor(Math.random() * 50000000).toLocaleString()
  };
}

export function getMockTimeSeries(symbol) {
  const prices = { AAPL:189, MSFT:415, TSLA:248, NVDA:875, GOOGL:174 };
  let base = prices[symbol] || 150;
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    base += (Math.random() - 0.47) * (base * 0.02);
    const open = base;
    const close = base + (Math.random() - 0.5) * (base * 0.01);
    const high = Math.max(open, close) + Math.random() * (base * 0.005);
    const low = Math.min(open, close) - Math.random() * (base * 0.005);
    data.push({
      date: d.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 30000000)
    });
  }
  return data;
}

export const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "TSLA", "NVDA", "GOOGL"];
export const NEWS_MOCK = [
  { source: "Reuters", time: "1h ago", title: "Apple hits record high as services revenue beats expectations" },
  { source: "Bloomberg", time: "3h ago", title: "Fed holds rates steady, signals two cuts possible in 2026" },
  { source: "CNBC", time: "5h ago", title: "Nvidia posts record data centre revenue, shares surge" },
  { source: "WSJ", time: "7h ago", title: "Tesla deliveries beat Q1 estimates, gross margins improve" },
  { source: "FT", time: "9h ago", title: "Microsoft Azure growth accelerates on AI cloud demand" },
  { source: "MarketWatch", time: "12h ago", title: "S&P 500 notches fourth consecutive weekly gain" }
];
