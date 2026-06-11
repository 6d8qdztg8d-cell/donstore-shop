import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NewsletterSchema } from "@/lib/validations";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = NewsletterSchema.parse(body);

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 422 });
    }
    return NextResponse.json({ error: "Fehler beim Anmelden" }, { status: 500 });
  }
}
