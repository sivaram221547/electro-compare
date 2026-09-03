import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Get all pending & registered showrooms
export async function GET() {
  try {
    const showrooms = await prisma.showroom.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        showroomName: true,
        ownerName: true,
        mobileNumber: true,
        city: true,
        address: true,
        gstNumber: true,
        frontPhoto: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json(showrooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Approve or Reject a showroom
export async function PATCH(req: Request) {
  try {
    const { showroomId, status } = await req.json(); // status: "VERIFIED" | "REJECTED"

    if (!showroomId || !["VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedShowroom = await prisma.showroom.update({
      where: { id: showroomId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Showroom marked as ${status}`,
      showroom: updatedShowroom,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}