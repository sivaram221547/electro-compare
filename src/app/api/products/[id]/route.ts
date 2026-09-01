import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Ongole";

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        dealers: {
          include: {
            showroom: true,
          },
          where: {
            showroom: {
              city: {
                equals: city,
              },
            },
          },
          orderBy: {
            price: "asc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}