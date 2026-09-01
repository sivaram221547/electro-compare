import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ownerName, city, area, phone, password, gstin } = body;

    if (!name || !ownerName || !city || !area || !phone || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const existingShowroom = await prisma.showroom.findUnique({
      where: { phone },
    });

    if (existingShowroom) {
      return NextResponse.json(
        { error: "A showroom with this phone number is already registered." },
        { status: 409 }
      );
    }

    const newShowroom = await prisma.showroom.create({
      data: {
        name,
        ownerName,
        city,
        area,
        phone,
        password,
        gstin: gstin || null,
      },
    });

    return NextResponse.json({
      success: true,
      showroom: {
        id: newShowroom.id,
        name: newShowroom.name,
        city: newShowroom.city,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}