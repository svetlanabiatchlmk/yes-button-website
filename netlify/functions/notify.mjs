
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);

export default async (request) => {
  const origin = request.headers.get("origin") || "";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };

  if (allowedOrigins.length && !allowedOrigins.includes(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers });
  }

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
  }

  if (payload?.answer !== "yes") {
    return new Response(JSON.stringify({ error: "Invalid answer" }), { status: 400, headers });
  }

  const { EMAIL_TO, RESEND_API_KEY, EMAIL_FROM } = process.env;
  if (!EMAIL_TO || !RESEND_API_KEY || !EMAIL_FROM) {
    return new Response(JSON.stringify({ error: "Email service is not configured" }), { status: 500, headers });
  }

  const emailBody = {
    from: EMAIL_FROM,
    to: [EMAIL_TO],
    subject: "He clicked YES ♡",
    text: `Your yes-button website received a YES.\n\nTime: ${payload.submittedAt || new Date().toISOString()}\nWebsite: ${payload.page || "unknown"}`
  };

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailBody)
    });

    if (!result.ok) {
      console.error("Email provider error:", await result.text());
      return new Response(JSON.stringify({ error: "Could not send email" }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Email service unavailable" }), { status: 502, headers });
  }
};
