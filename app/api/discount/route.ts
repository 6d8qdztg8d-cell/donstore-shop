import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DiscountCheckSchema } from "@/lib/validations";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = DiscountCheckSchema.parse(body);

    const discount = await prisma.discountCode.findUnique({ where: { code } });
    if (!discount || !discount.active) {
      return NextResponse.json({ error: "Code nicht gefunden" }, { status: 404 });
    }
    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code abgelaufen" }, { status: 400 });
    }
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ error: "Code bereits aufgebraucht" }, { status: 400 });
    }
    if (discount.minOrder && subtotal < discount.minOrder) {
      return NextResponse.json({ error: `Mindestbestellwert: ${discount.minOrder.toFixed(2)} €` }, { status: 400 });
    }

    const discountAmount =
      discount.type === "PERCENTAGE"
        ? Math.round((subtotal * discount.value) / 100 * 100) / 100
        : Math.min(discount.value, subtotal);

    return NextResponse.json({ code: discount.code, discountAmount });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 422 });
    }
    return NextResponse.json({ error: "Fehler beim Prüfen" }, { status: 500 });
  }
}
