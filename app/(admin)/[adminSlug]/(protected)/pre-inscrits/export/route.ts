import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSlug, getSession } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Export CSV des pré-inscrits (séparateur « ; » pour Excel/Numbers en français). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ adminSlug: string }> },
) {
  const { adminSlug } = await params;
  if (adminSlug !== getAdminSlug()) return new NextResponse(null, { status: 404 });
  if (!(await getSession())) return new NextResponse(null, { status: 401 });

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const rows = await db.preregistration.findMany({
    where: q ? { email: { contains: q, mode: "insensitive" } } : {},
    orderBy: { createdAt: "desc" },
    select: { email: true, source: true, createdAt: true, codeSentAt: true, promoCode: { select: { code: true, expiresAt: true } } },
  });

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    ["email", "source", "date", "code_promo", "code_expire_le", "code_envoye_le"].join(";"),
    ...rows.map((r) =>
      [
        r.email,
        r.source,
        r.createdAt.toISOString(),
        r.promoCode?.code ?? "",
        r.promoCode?.expiresAt?.toISOString() ?? "",
        r.codeSentAt?.toISOString() ?? "",
      ]
        .map(escape)
        .join(";"),
    ),
  ];
  const body = "﻿" + lines.join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pre-inscrits-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
