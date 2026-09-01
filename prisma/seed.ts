import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.showroomStock.deleteMany();
  await prisma.showroom.deleteMany();
  await prisma.product.deleteMany();

  // 1. Create Ongole Showrooms
  const pai = await prisma.showroom.create({
    data: {
      id: "shw-pai-kurnool",
      name: "Pai International",
      ownerName: "Pai Store Manager",
      city: "Ongole",
      area: "Kurnool Road",
      phone: "+91 86322 10001",
    },
  });

  const bajaj = await prisma.showroom.create({
    data: {
      id: "shw-bajaj-trunk",
      name: "Bajaj Electronics",
      ownerName: "Bajaj Store Manager",
      city: "Ongole",
      area: "Trunk Road",
      phone: "+91 86322 10002",
    },
  });

  const reliance = await prisma.showroom.create({
    data: {
      id: "shw-reliance-lawyerpet",
      name: "Reliance Digital",
      ownerName: "Reliance Store Manager",
      city: "Ongole",
      area: "Lawyerpet",
      phone: "+91 86322 10003",
    },
  });

  // 2. Create Products
  const tv = await prisma.product.create({
    data: {
      id: "samsung-55-crystal-4k",
      name: 'Samsung 55" Crystal 4K UHD Smart TV (2025 Model)',
      category: "Smart TVs",
      image: "📺",
      mrp: 64900,
      rating: 4.6,
      reviewsCount: 142,
      displaySize: '55 Inch',
      resolution: "4K UHD (3840 x 2160)",
      energyRating: "4 Star",
      warranty: "1 Year Complete + 1 Year Panel",
    },
  });

  const fridge = await prisma.product.create({
    data: {
      id: "lg-260l-frost-free",
      name: "LG 260L 3-Star Smart Inverter Double Door Refrigerator",
      category: "Refrigerators",
      image: "🧊",
      mrp: 33990,
      rating: 4.8,
      reviewsCount: 98,
      capacity: "260 Litres",
      energyRating: "3 Star",
      warranty: "10 Years on Compressor",
    },
  });

  const ac = await prisma.product.create({
    data: {
      id: "daikin-1-5-ton-3star-ac",
      name: "Daikin 1.5 Ton 3 Star Inverter Split AC",
      category: "Air Conditioners",
      image: "❄️",
      mrp: 48500,
      rating: 4.7,
      reviewsCount: 64,
      capacity: "1.5 Ton",
      energyRating: "3 Star",
      warranty: "5 Years on PCB + 10 Years Compressor",
    },
  });

  // 3. Connect Showroom Stock & Live Pricing
  await prisma.showroomStock.createMany({
    data: [
      {
        showroomId: pai.id,
        productId: tv.id,
        price: 42990,
        inStock: true,
        stockCount: 4,
        activeDeal: "₹3,000 Exchange Bonus",
        distanceKm: 1.4,
      },
      {
        showroomId: bajaj.id,
        productId: tv.id,
        price: 43490,
        inStock: true,
        stockCount: 2,
        activeDeal: "HDFC 10% Instant Cashback",
        distanceKm: 0.8,
      },
      {
        showroomId: reliance.id,
        productId: tv.id,
        price: 44200,
        inStock: true,
        stockCount: 5,
        activeDeal: "Free Soundbar Bundle",
        distanceKm: 2.1,
      },
      {
        showroomId: bajaj.id,
        productId: fridge.id,
        price: 24490,
        inStock: true,
        stockCount: 5,
        activeDeal: "Free 10-Yr Warranty",
        distanceKm: 0.8,
      },
      {
        showroomId: reliance.id,
        productId: ac.id,
        price: 36990,
        inStock: true,
        stockCount: 3,
        activeDeal: "Free Installation Kit",
        distanceKm: 2.1,
      },
    ],
  });

  console.log("Database seeded successfully with local Ongole showroom deals!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());