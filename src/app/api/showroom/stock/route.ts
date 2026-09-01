import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET showroom inventory for the dashboard
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showroomId = searchParams.get("showroomId") || "shw-pai-kurnool";

  try {
    const inventory = await prisma.showroomStock.findMany({
      where: { showroomId },
      include: {
        product: true,
        showroom: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = inventory.map((item) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      category: item.product.category,
      image: item.product.image,
      mrp: item.product.mrp,
      price: item.price,
      inStock: item.inStock,
      stockCount: item.stockCount,
      activeDeal: item.activeDeal || "No active offer",
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, inventory: formatted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// PATCH to update price, stock status, or promo deal
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { stockId, price, inStock, stockCount, activeDeal } = body;

    if (!stockId) {
      return NextResponse.json(
        { success: false, error: "Stock ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.showroomStock.update({
      where: { id: stockId },
      data: {
        ...(price !== undefined && { price: Number(price) }),
        ...(inStock !== undefined && { inStock: Boolean(inStock) }),
        ...(stockCount !== undefined && { stockCount: Number(stockCount) }),
        ...(activeDeal !== undefined && { activeDeal: String(activeDeal) }),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update stock" },
      { status: 500 }
    );
  }
}