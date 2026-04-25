import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(`register:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already used" }, { status: 409 });
  }

  const passwordHash = await hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      settings: {
        create: {
          timezone: "Australia/Melbourne",
          currency: "AUD",
          electricityPricePerKwh: 0.25,
          carKmPerLitre: 14,
          scooterKwhPerKm: 0.03
        }
      },
      profiles: {
        create: [
          { name: "E-Scooter", kind: "SCOOTER", kmRate: 0 },
          { name: "Car", kind: "CAR", kmRate: 0 }
        ]
      }
    }
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
