import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city") || "Ongole";

  try {
    const products = await prisma.product.findMany({
      where: category && category !== "all" ? { category } : undefined,
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
        },
      },
    });

    const formatted = products.map((prod) => {
      const activeDealers = prod.dealers.filter((d) => d.inStock);
      const lowestDealer = [...prod.dealers].sort((a, b) => a.price - b.price)[0];

      return {
        id: prod.id,
        name: prod.name,
        category: prod.category,
        image: prod.image,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        mrp: prod.mrp,
        lowestPrice: lowestDealer ? lowestDealer.price : prod.mrp,
        bestDealShowroom: lowestDealer ? lowestDealer.showroom.name : "Contact for pricing",
        distanceKm: lowestDealer ? lowestDealer.distanceKm : 1.0,
        dealType: lowestDealer?.activeDeal || "Standard Warranty",
        totalShowrooms: prod.dealers.length,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}