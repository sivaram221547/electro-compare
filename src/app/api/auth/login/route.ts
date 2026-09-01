import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "electrocompare_jwt_super_secret_key_2026"
);

export async function POST(request: Request) {
  try {
    const { identifier, password, role } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifier and password required" },
        { status: 400 }
      );
    }

    if (role === "showroom") {
      // Find showroom by phone number
      const showroom = await prisma.showroom.findUnique({
        where: { phone: identifier },
      });

      if (!showroom || showroom.password !== password) {
        return NextResponse.json(
          { error: "Invalid showroom phone or password" },
          { status: 401 }
        );
      }

      const token = await new SignJWT({
        id: showroom.id,
        name: showroom.name,
        role: "showroom",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

      const response = NextResponse.json({
        success: true,
        user: { id: showroom.id, name: showroom.name, role: "showroom" },
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    } else {
      // Customer login by email
      const user = await prisma.user.findUnique({
        where: { email: identifier },
      });

      if (!user) {
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        );
      }

      const token = await new SignJWT({
        id: user.id,
        name: user.name,
        role: "customer",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, role: "customer" },
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}