import { PrismaClient, ShowroomType, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up old database records...");
  await prisma.showroomStock.deleteMany();
  await prisma.showroom.deleteMany();
  await prisma.product.deleteMany();

  // 1. Create Verified Ongole Showrooms
  console.log("Seeding verified showrooms...");
  const pai = await prisma.showroom.create({
    data: {
      id: "shw-pai-kurnool",
      showroomName: "Pai International Electronics",
      ownerName: "Sivaram",
      mobileNumber: "9876543210",
      email: "pai.ongole@example.com",
      category: ShowroomType.MULTI_BRAND,
      address: "Beside RTC Bus Stand, Kurnool Road",
      villageTown: "Trunk Road Area",
      city: "Ongole",
      district: "Prakasam",
      state: "Andhra Pradesh",
      pincode: "523001",
      latitude: 15.5057,
      longitude: 80.0499,
      showroomPhone: "+91 86322 10001",
      status: VerificationStatus.VERIFIED,
      frontPhoto: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500",
    },
  });

  const bajaj = await prisma.showroom.create({
    data: {
      id: "shw-bajaj-trunk",
      showroomName: "Bajaj Electronics",
      ownerName: "Ramesh Babu",
      mobileNumber: "9876543211",
      email: "bajaj.ongole@example.com",
      category: ShowroomType.MULTI_BRAND,
      address: "Near Clock Tower, Trunk Road",
      villageTown: "Center Area",
      city: "Ongole",
      district: "Prakasam",
      state: "Andhra Pradesh",
      pincode: "523001",
      latitude: 15.5034,
      longitude: 80.0452,
      showroomPhone: "+91 86322 10002",
      status: VerificationStatus.VERIFIED,
      frontPhoto: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500",
    },
  });

  const reliance = await prisma.showroom.create({
    data: {
      id: "shw-reliance-lawyerpet",
      showroomName: "Reliance Digital",
      ownerName: "Kishore Kumar",
      mobileNumber: "9876543212",
      email: "reliance.ongole@example.com",
      category: ShowroomType.ELECTRONICS,
      address: "Opposite Municipal Stadium, Lawyerpet",
      villageTown: "Lawyerpet",
      city: "Ongole",
      district: "Prakasam",
      state: "Andhra Pradesh",
      pincode: "523002",
      latitude: 15.5121,
      longitude: 80.0523,
      showroomPhone: "+91 86322 10003",
      status: VerificationStatus.VERIFIED,
      frontPhoto: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
    },
  });

  // 2. Create Master Catalog Products (with Deep Mobile Specs)
  console.log("Seeding Master Catalog products...");
  const s24Ultra = await prisma.product.create({
    data: {
      id: "samsung-galaxy-s24-ultra",
      name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
      brand: "Samsung",
      category: "Smartphones",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      mrp: 129999,
      rating: 4.8,
      reviewsCount: 2480,
      warranty: "1 Year Device + 6 Months In-Box Accessories",
      displaySize: '6.8 Inch QHD+ 120Hz',
      resolution: "1440 x 3120 pixels",
      specs: {
        launch: { announced: "17 Jan, 2024", released: "24 Jan, 2024", status: "Available" },
        display: {
          screenSize: '6.8 Inches',
          type: "Dynamic LTPO AMOLED 2X",
          resolution: "1440 x 3120 pixels (QHD+)",
          refreshRate: "120Hz",
          peakBrightness: "2600 nits",
          protection: "Corning Gorilla Glass Armor",
          hdr: "HDR10+",
        },
        performance: {
          chipset: "Snapdragon 8 Gen 3 for Galaxy (4 nm)",
          cpu: "Octa-core up to 3.39 GHz",
          gpu: "Adreno 750",
          os: "Android 14, One UI 6.1",
          antutuScore: "1,770,105",
        },
        memoryAndStorage: { ram: "12GB", storageVariants: ["256GB", "512GB", "1TB"], storageType: "UFS 4.0" },
        rearCamera: {
          setup: "Quad Camera (200MP + 50MP 5x Zoom + 12MP Ultra-Wide + 10MP 3x Zoom)",
          features: "Laser AF, OIS, 8K Video Recording @ 30fps",
        },
        frontCamera: { single: "12 MP Dual Pixel PDAF", video: "4K @ 60fps" },
        batteryAndCharging: {
          capacity: "5000 mAh",
          wiredCharging: "45W PD3.0 (65% in 30 mins)",
          wirelessCharging: "15W wireless + 4.5W reverse wireless",
        },
        connectivity: { network: "5G Dual SIM", wifi: "Wi-Fi 7", bluetooth: "5.3", nfc: "Yes" },
      },
    },
  });

  const tv = await prisma.product.create({
    data: {
      id: "samsung-55-crystal-4k",
      name: 'Samsung 55" Crystal 4K UHD Smart TV (2025 Model)',
      brand: "Samsung",
      category: "Smart TVs",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
      mrp: 64900,
      rating: 4.6,
      reviewsCount: 142,
      displaySize: '55 Inch',
      resolution: "4K UHD (3840 x 2160)",
      energyRating: "4 Star",
      warranty: "1 Year Complete + 1 Year Panel",
      specs: {
        display: { size: "55 Inches", panel: "Crystal 4K LED", hdr: "HDR10+" },
        audio: { soundOutput: "20W", technology: "OTS Lite, Dolby Digital Plus" },
      },
    },
  });

  const fridge = await prisma.product.create({
    data: {
      id: "lg-260l-frost-free",
      name: "LG 260L 3-Star Smart Inverter Double Door Refrigerator",
      brand: "LG",
      category: "Refrigerators",
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800",
      mrp: 33990,
      rating: 4.8,
      reviewsCount: 98,
      capacity: "260 Litres",
      energyRating: "3 Star",
      warranty: "10 Years on Compressor",
      specs: {
        refrigeratorType: "Double Door Frost Free",
        compressor: "Smart Inverter Compressor",
        coolingTechnology: "Multi Air Flow",
      },
    },
  });

  // 3. Connect Showroom Stock, Live Pricing & Quotes Highlights
  console.log("Connecting Showroom Stock with Highlighted Offers...");
  await prisma.showroomStock.createMany({
    data: [
      {
        showroomId: pai.id,
        productId: s24Ultra.id,
        price: 114999,
        inStock: true,
        stockCount: 3,
        // Active deal with double quotes for gold badge highlighting
        activeDeal: 'Free 45W Charger + "₹7,000 Instant HDFC Cashback"',
        distanceKm: 1.4,
        isPublished: true,
      },
      {
        showroomId: bajaj.id,
        productId: s24Ultra.id,
        price: 116500,
        inStock: true,
        stockCount: 2,
        activeDeal: 'Exchange Bonus + "₹5,000 Special Festival Discount"',
        distanceKm: 0.8,
        isPublished: true,
      },
      {
        showroomId: pai.id,
        productId: tv.id,
        price: 42990,
        inStock: true,
        stockCount: 4,
        activeDeal: 'Free Wall Mount + "₹3,000 Exchange Bonus"',
        distanceKm: 1.4,
        isPublished: true,
      },
      {
        showroomId: bajaj.id,
        productId: tv.id,
        price: 43490,
        inStock: true,
        stockCount: 2,
        activeDeal: '"10% Instant Cashback" on ICICI Cards',
        distanceKm: 0.8,
        isPublished: true,
      },
      {
        showroomId: reliance.id,
        productId: fridge.id,
        price: 24490,
        inStock: true,
        stockCount: 5,
        activeDeal: '10-Yr Compressor Warranty + "Free Delivery"',
        distanceKm: 2.1,
        isPublished: true,
      },
    ],
  });

  console.log("Database seeded successfully with S24 Ultra, TVs, and local Ongole deals!");
}

main()
  .catch((e) => {
    console.error("Seed execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });