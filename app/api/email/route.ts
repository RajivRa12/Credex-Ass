import { NextResponse } from "next/server";

interface LeadRequestBody {
  email?: string;
  shareUrl?: string;
  auditToken?: string;
  result?: {
    id?: string;
    companyName?: string;
    verdict?: string;
    healthScore?: number;
    monthlySavings?: number;
    annualSavings?: number;
    summary?: string;
    useCase?: string;
    teamSize?: number;
    currentMonthlySpend?: number;
    recommendedMonthlySpend?: number;
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function storeInSupabase(payload: LeadRequestBody, shareUrl: string) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return {
      storedInSupabase: false,
      warning: "Supabase credentials are not configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    };
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/audit_leads`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email: payload.email,
      share_url: shareUrl,
      audit_token: payload.auditToken ?? null,
      audit_id: payload.result?.id ?? null,
      company_name: payload.result?.companyName ?? null,
      verdict: payload.result?.verdict ?? null,
      health_score: payload.result?.healthScore ?? null,
      monthly_savings: payload.result?.monthlySavings ?? null,
      annual_savings: payload.result?.annualSavings ?? null,
      summary: payload.result?.summary ?? null,
      use_case: payload.result?.useCase ?? null,
      team_size: payload.result?.teamSize ?? null,
      current_monthly_spend: payload.result?.currentMonthlySpend ?? null,
      recommended_monthly_spend: payload.result?.recommendedMonthlySpend ?? null,
      created_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${message}`);
  }

  return { storedInSupabase: true };
}

async function sendConfirmationEmail(payload: LeadRequestBody, shareUrl: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    return { confirmationSent: false, warning: "Resend credentials are not configured yet." };
  }

  const companyName = payload.result?.companyName ?? "your team";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [payload.email],
      subject: `Your SpendScope AI audit for ${companyName}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h1 style="margin: 0 0 16px;">Your SpendScope AI audit is ready</h1>
          <p style="margin: 0 0 12px;">We captured your audit and created a shareable public URL for ${companyName}.</p>
          <p style="margin: 0 0 20px;"><strong>Health score:</strong> ${payload.result?.healthScore ?? "N/A"}/100</p>
          <p style="margin: 0 0 20px;"><strong>Estimated monthly savings:</strong> $${(payload.result?.monthlySavings ?? 0).toFixed(2)}</p>
          <a href="${shareUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #7bf0c7; color: #07201a; text-decoration: none; font-weight: 600;">Open shareable result</a>
        </div>
      `,
      text: `Your SpendScope AI audit for ${companyName} is ready. Open ${shareUrl} to view the public result.`,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${message}`);
  }

  return { confirmationSent: true };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadRequestBody;

  if (!payload.email || !isValidEmail(payload.email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (!payload.shareUrl || !payload.shareUrl.startsWith("/results/")) {
    return NextResponse.json({ error: "A valid share URL is required." }, { status: 400 });
  }

  const siteUrl = new URL(request.url).origin;
  const shareUrl = new URL(payload.shareUrl, siteUrl).toString();

  try {
    const storageResult = await storeInSupabase(payload, shareUrl);
    const emailResult = await sendConfirmationEmail(payload, shareUrl);

    return NextResponse.json({
      shareUrl,
      ...storageResult,
      ...emailResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to capture the lead right now.",
      },
      { status: 500 },
    );
  }
}