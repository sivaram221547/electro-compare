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
          where: {
            inStock: true,
            isPublished: true,
            showroom: {
              city: {
                equals: city,
                mode: "insensitive",
              },
              status: "VERIFIED", // Only verified showrooms
            },
          },
          include: {
            showroom: true,
          },
        },
      },
    });

    // Showroom register ayyi, verified ayyi, stock add chesina products matrame display avtai
    const activeProducts = products.filter((prod) => prod.dealers.length > 0);

    const formatted = activeProducts.map((prod) => {
      const sortedDealers = [...prod.dealers].sort((a, b) => a.price - b.price);
      const lowestDealer = sortedDealers[0];

      return {
        id: prod.id,
        name: prod.name,
        category: prod.category,
        image: prod.image,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        mrp: prod.mrp,
        lowestPrice: lowestDealer ? lowestDealer.price : prod.mrp,
        showroomName: lowestDealer ? lowestDealer.showroom.showroomName : "Local Partner Showroom",
        address: lowestDealer ? `${lowestDealer.showroom.address}, ${lowestDealer.showroom.city}` : `${city}, Andhra Pradesh`,
        phone: lowestDealer?.showroom?.showroomPhone || lowestDealer?.showroom?.mobileNumber || "",
        distanceKm: lowestDealer ? lowestDealer.distanceKm : 1.5,
        dealType: lowestDealer?.activeDeal || "Standard Warranty",
        totalShowrooms: prod.dealers.length,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Failed to fetch verified products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}