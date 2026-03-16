const API_KEY = "d6s51jhr01qrb5i8lumgd6s51jhr01qrb5i8lun0";
const BASE = "https://finnhub.io/api/v1";

const cache = {};
function cached(key, fn, ttl = 30000) {
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < ttl) return Promise.resolve(cache[key].data);
  return fn().then(data => { cache[key] = { data, ts: now }; return data; });
}

export async function getQuote(symbol) {
  return cached(`quote_${symbol}`, async () => {
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`${BASE}/quote?symbol=${symbol}&token=${API_KEY}`),
      fetch(`${BASE}/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
    ]);
    const q = await quoteRes.json();
    const p = await profileRes.json();
    if (!q || q.c === 0) return getMockQuote(symbol);
    const change = (q.c - q.pc).toFixed(2);
    const changePct = (((q.c - q.pc) / q.pc) * 100).toFixed(2);
    return {
      symbol, name: p.name || symbol,
      price: q.c.toFixed(2), change, changePct,
      open: q.o.toFixed(2), high: q.h.toFixed(2),
      low: q.l.toFixed(2), prevClose: q.pc.toFixed(2), volume: "—"
    };
  }, 30000);
}

export async function getTimeSeries(symbol, range = "1M") {
  return cached(`candle_${symbol}_${range}`, async () => {
    const now = Math.floor(Date.now() / 1000);
    const days = { "1W": 7, "1M": 30, "3M": 90 }[range] || 30;
    const from = now - days * 24 * 60 * 60;
    const res = await fetch(`${BASE}/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${API_KEY}`);
    const json = await res.json();
    if (!json || json.s !== "ok" || !json.t) return getMockTimeSeries(symbol);
    return json.t.map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      open: parseFloat(json.o[i].toFixed(2)),
      high: parseFloat(json.h[i].toFixed(2)),
      low: parseFloat(json.l[i].toFixed(2)),
      close: parseFloat(json.c[i].toFixed(2)),
      volume: json.v[i]
    }));
  }, 60000);
}

export async function searchSymbol(query) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`);
  const json = await res.json();
  if (!json || !json.result) return [];
  return json.result.slice(0, 6).map(m => ({
    symbol: m.symbol, name: m.description, type: m.type, region: "US"
  }));
}

export function getMockQuote(symbol) {
  const prices = { AAPL:189.30, MSFT:415.10, TSLA:248.50, NVDA:875.20, GOOGL:174.90, AMZN:192.50, META:530.80, NFLX:645.20 };
  const base = prices[symbol] || 100 + Math.random() * 200;
  const change = (Math.random() - 0.48) * 6;
  return {
    symbol, name: symbol, price: base.toFixed(2),
    change: change.toFixed(2), changePct: ((change/base)*100).toFixed(2),
    open: (base-1).toFixed(2), high: (base+Math.random()*3).toFixed(2),
    low: (base-Math.random()*3).toFixed(2), prevClose: (base-change).toFixed(2), volume: "—"
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
      open: parseFloat(open.toFixed(2)), high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)), close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 30000000)
    });
  }
  return data;
}

export const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "TSLA", "NVDA", "GOOGL"];
export const NEWS_MOCK = [
  { source: "Reuters", time: "1h ago", title: "Apple hits record high as services revenue beats expectations" },
  { source: "Bloomberg", time: "3h ago", title: "Fed holds rates steady, signals two cuts possible in 2026" },
  { source: "CNBC", time: "5h ago", title: "Nvidia posts record data centre revenue, shares surge 8%" },
  { source: "WSJ", time: "7h ago", title: "Tesla deliveries beat Q1 estimates, gross margins improve" },
  { source: "FT", time: "9h ago", title: "Microsoft Azure growth accelerates on AI cloud demand" },
  { source: "MarketWatch", time: "12h ago", title: "S&P 500 notches fourth consecutive weekly gain in 2026" }
];
