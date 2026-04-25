import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { settingsSchema } from "@/lib/validation";
import { serializeSettings } from "@/lib/serializers";

export async function GET() {
  try {
    const session = await requireSession();

    let settings = await prisma.userSettings.findUnique({ where: { userId: session.user.id } });
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          timezone: "Australia/Melbourne",
          currency: "AUD",
          electricityPricePerKwh: 0.25,
          carKmPerLitre: 14,
          scooterKwhPerKm: 0.03
        }
      });
    }

    return NextResponse.json(serializeSettings(settings));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updated = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, ...parsed.data },
      update: parsed.data
    });

    return NextResponse.json(serializeSettings(updated));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
