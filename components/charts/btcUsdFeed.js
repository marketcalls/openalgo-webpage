/**
 * Public BTC/USD candles from Gemini, ported unchanged from the openalgo-charts
 * docs site so the two pages cannot drift into disagreeing about the same
 * number. Prices are accepted only from a validated market response.
 *
 * No dependencies and no keys: the endpoint is public and the browser calls it
 * directly, so nothing here reaches the Worker.
 */
export const BTC_USD_SOURCE = 'https://developer.gemini.com/trading/rest-api/market-data/list-candles';
export const BTC_USD_REFRESH_MS = 15000;
export const BTC_USD_INTERVALS = ['15m', '1h', '4h', '1d'];

/**
 * How many candles to keep from a response.
 *
 * This endpoint takes no range and no cursor: one call returns a fixed history
 * and there is no older page to ask for. So the only scrollback a reader gets
 * is whatever is kept here, and keeping 320 threw most of it away. Measured on
 * the public endpoint: 1487 hourly candles came back and 320 were kept, which
 * is why the chart ran out of candles a screen or two to the left.
 *
 * The cap stays high enough to hold everything the endpoint currently returns
 * at any timeframe, and exists at all so a response that grows without bound
 * cannot put an unbounded series on the page.
 */
const MAX_BARS = 2000;
const ENDPOINTS = { '15m': '15m', '1h': '1hr', '4h': '1hr', '1d': '1day' };
const CANDLE_URL = 'https://api.gemini.com/v2/candles/btcusd/';

/** @typedef {{time: number, open: number, high: number, low: number, close: number, volume: number}} Candle */

/** Convert newest-first millisecond OHLCV rows into validated ascending candles. */
export function parseCandles(payload) {
  if (!Array.isArray(payload) || payload.length === 0) throw new Error('Market candle data is unavailable.');
  const byTime = new Map();
  for (const row of payload) {
    if (!Array.isArray(row) || row.length < 6 || row.slice(0, 6).some(value => typeof value !== 'number' || !Number.isFinite(value))) {
      throw new Error('Invalid market candle response.');
    }
    const [timestamp, open, high, low, close, volume] = row;
    const time = timestamp / 1000;
    if (!Number.isSafeInteger(time) || time <= 0 || Math.min(open, high, low, close) <= 0 || high < Math.max(open, close) || low > Math.min(open, close) || volume < 0) {
      throw new Error('Invalid market candle values.');
    }
    if (!byTime.has(time)) byTime.set(time, { time, open, high, low, close, volume });
  }
  return [...byTime.values()].sort((a, b) => a.time - b.time);
}

/** Aggregate real candles into UTC-aligned buckets; omit a leading partial bucket. */
export function aggregateCandles(bars, seconds) {
  const result = [];
  let bucket;
  for (const bar of bars) {
    const time = Math.floor(bar.time / seconds) * seconds;
    if (!bucket || bucket.time !== time) {
      if (bar.time !== time) { bucket = undefined; continue; }
      bucket = { ...bar, time };
      result.push(bucket);
    } else {
      bucket.high = Math.max(bucket.high, bar.high);
      bucket.low = Math.min(bucket.low, bar.low);
      bucket.close = bar.close;
      bucket.volume += bar.volume;
    }
  }
  return result;
}

/**
 * Own a single cancellable polling session. Selecting a timeframe invalidates all
 * earlier work. A failed refresh preserves real history and explicitly marks it stale.
 */
export function createBtcUsdFeed({
  onBars, onStatus, fetchImpl = globalThis.fetch, now = Date.now,
  setTimer = setTimeout, clearTimer = clearTimeout,
  refreshMs = BTC_USD_REFRESH_MS, timeoutMs = 10000,
}) {
  let interval = '1h';
  let sequence = 0;
  let disposed = false;
  let controller;
  let refreshTimer;
  let requestTimer;
  let hasData = false;
  let lastUpdate;

  function cancelPending() {
    if (refreshTimer !== undefined) clearTimer(refreshTimer);
    if (requestTimer !== undefined) clearTimer(requestTimer);
    refreshTimer = undefined;
    requestTimer = undefined;
    controller?.abort();
    controller = undefined;
  }

  async function refresh() {
    if (disposed) return;
    cancelPending();
    const current = ++sequence;
    const requestedInterval = interval;
    const request = new AbortController();
    controller = request;
    const timeout = setTimer(() => request.abort(), timeoutMs);
    requestTimer = timeout;
    if (!hasData) onStatus({ state: 'loading', interval: requestedInterval });
    try {
      const response = await fetchImpl(CANDLE_URL + ENDPOINTS[requestedInterval], {
        signal: request.signal, cache: 'no-store', credentials: 'omit',
      });
      if (!response.ok) throw new Error(`Market data request failed (${response.status}).`);
      const parsed = parseCandles(await response.json());
      if (disposed || current !== sequence) return;
      const bars = (requestedInterval === '4h' ? aggregateCandles(parsed, 14400) : parsed).slice(-MAX_BARS);
      if (bars.length === 0) throw new Error('Market candles are not available for this interval.');
      onBars(bars, requestedInterval);
      hasData = true;
      lastUpdate = { updatedAt: now(), barTime: bars.at(-1).time, close: bars.at(-1).close };
      onStatus({ state: 'connected', interval: requestedInterval, ...lastUpdate });
    } catch (error) {
      if (disposed || current !== sequence) return;
      onStatus({
        state: hasData ? 'stale' : 'error', interval: requestedInterval, ...lastUpdate,
        message: request.signal.aborted ? 'Market data request timed out.' : error instanceof Error ? error.message : 'Market data is unavailable.',
      });
    } finally {
      clearTimer(timeout);
      if (!disposed && current === sequence) {
        requestTimer = undefined;
        controller = undefined;
        refreshTimer = setTimer(refresh, refreshMs);
      }
    }
  }

  return {
    async selectInterval(nextInterval) {
      if (!Object.hasOwn(ENDPOINTS, nextInterval)) throw new Error('Unsupported BTC/USD interval.');
      if (disposed) return;
      interval = nextInterval;
      hasData = false;
      lastUpdate = undefined;
      await refresh();
    },
    refresh,
    destroy() {
      disposed = true;
      sequence++;
      cancelPending();
    },
  };
}

/**
 * One-shot candles for the demo cards, which illustrate rather than track.
 *
 * The cards used generated random walks once. A random walk is a meaningless
 * squiggle to anyone who reads charts for a living, and this page is read by
 * traders, brokers and investors: a demo has to show the engine drawing
 * something they recognise or it argues against itself.
 *
 * Returns null rather than throwing when the public endpoint cannot be reached,
 * so a caller falls back to generated bars and the page still works.
 */
export async function fetchCandlesOnce(interval = '1d', { fetchImpl = globalThis.fetch, timeoutMs = 10000 } = {}) {
  if (!Object.hasOwn(ENDPOINTS, interval)) return null;
  const request = new AbortController();
  const timeout = setTimeout(() => request.abort(), timeoutMs);
  try {
    const response = await fetchImpl(CANDLE_URL + ENDPOINTS[interval], {
      signal: request.signal, cache: 'no-store', credentials: 'omit',
    });
    if (!response.ok) return null;
    const bars = parseCandles(await response.json());
    return bars.length ? bars : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
