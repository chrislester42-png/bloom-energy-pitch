// Netlify serverless function — proxies a live BE quote so the API key
// stays server-side. Set FINNHUB_API_KEY in Netlify → Site settings → Env vars.
// Endpoint: /.netlify/functions/quote
export default async () => {
  const headers = {
    "content-type": "application/json",
    "cache-control": "public, max-age=30",
  };
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return new Response(JSON.stringify({ ok: false, reason: "no-key" }), {
      status: 200,
      headers,
    });
  }
  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=BE&token=${key}`,
    );
    const d = await r.json();
    // Finnhub: c=current, d=change, dp=%change, pc=prev close, t=epoch
    if (typeof d.c !== "number" || d.c === 0) {
      return new Response(JSON.stringify({ ok: false, reason: "no-data" }), {
        status: 200,
        headers,
      });
    }
    return new Response(
      JSON.stringify({
        ok: true,
        price: d.c,
        change: d.d,
        changePct: d.dp,
        prevClose: d.pc,
        t: d.t,
      }),
      { status: 200, headers },
    );
  } catch {
    return new Response(JSON.stringify({ ok: false, reason: "fetch-failed" }), {
      status: 200,
      headers,
    });
  }
};
