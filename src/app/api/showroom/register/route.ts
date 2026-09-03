import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step1, step2, step3 } = body;

    if (!step1?.mobileNumber || !step1?.ownerName || !step2?.showroomName) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    // Check if showroom mobile number or email already exists
    const existing = await prisma.showroom.findFirst({
      where: {
        OR: [
          { mobileNumber: step1.mobileNumber },
          ...(step1.email ? [{ email: step1.email }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A showroom with this mobile number or email already exists." },
        { status: 409 }
      );
    }

    const newShowroom = await prisma.showroom.create({
      data: {
        // Step 1: Owner & Login
        ownerName: step1.ownerName,
        mobileNumber: step1.mobileNumber,
        email: step1.email || null,
        password: step1.password || "dealer123",
        ownerPhoto: step1.ownerPhoto || null,

        // Step 2: Showroom Info & GPS
        showroomName: step2.showroomName,
        category: step2.category || "MULTI_BRAND",
        address: step2.address || "",
        villageTown: step2.villageTown || "",
        city: step2.city || "Ongole",
        district: step2.district || "Prakasam",
        state: step2.state || "Andhra Pradesh",
        pincode: step2.pincode || "523001",
        latitude: step2.latitude ? parseFloat(String(step2.latitude)) : null,
        longitude: step2.longitude ? parseFloat(String(step2.longitude)) : null,
        showroomPhone: step2.showroomPhone || step1.mobileNumber,
        showroomEmail: step2.showroomEmail || step1.email || null,
        workingHours: step2.workingHours || "10:00 AM - 09:30 PM",
        weeklyHoliday: step2.weeklyHoliday || "None",

        // Step 3: Verification & KYC
        gstNumber: step3?.gstNumber || null,
        gstCertificate: step3?.gstCertificate || null,
        ownerIdProof: step3?.ownerIdProof || null,
        shopProof: step3?.shopProof || null,
        frontPhoto: step3?.frontPhoto || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500",
        insidePhoto: step3?.insidePhoto || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Showroom registered successfully! Status is Pending Verification.",
      showroom: {
        id: newShowroom.id,
        name: newShowroom.showroomName,
        status: newShowroom.status,
      },
    });
  } catch (error: any) {
    console.error("Showroom registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register showroom" },
      { status: 500 }
    );
  }
}