import { PrismaClient, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const password = await bcrypt.hash("admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@donstore.de" },
    update: {},
    create: {
      email: "admin@donstore.de",
      name: "Donstore Admin",
      password,
      role: "SUPER_ADMIN",
    },
  });

  // Product: Grip Socks
  const product = await prisma.product.upsert({
    where: { slug: "donstore-grip-socks" },
    update: {},
    create: {
      name: "Donstore Grip Socks",
      slug: "donstore-grip-socks",
      description:
        "Donstore Grip Socks geben dir Halt, Komfort und Kontrolle bei jeder Bewegung. Die rutschfesten Grip-Punkte sorgen für starken Halt im Schuh, während das atmungsaktive Material deine Füße angenehm trocken hält. Perfekt für Fußball, Training und Alltag.",
      price: 19.99,
      comparePrice: 24.99,
      stock: 100,
      featured: true,
      active: true,
      sport: ["Fußball", "Fitness", "Alltag"],
      images: {
        create: [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxDCGzfQYELvN-nfUguxEu5xcDb-5qmaiqpB6hh0GP6gLnrz_-tVYNdC6sdvHcsjI8CksylDdlZUdLenacqB0QS9ctq2B3BjpA9wBDIhv8XIuU8WSv-i5r-CJrqZPqgLkyfie_NnPmWG1pmcYyYFRB7KdxwpJCZifpZBQzjmD8yfOkVrL-J1YjGG-rskYRKmPy4ewA2Xcc078ldV6Jhhn3gTKdLIsfOToKnP-B2SFoNzGoFYIv1YuvU1yOTptjfHviwC4zolpiYgw",
            alt: "Donstore Grip Socks – Weiß mit schwarzem Logo",
            isPrimary: true,
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          { size: "39–42", color: "Weiß", stock: 50 },
          { size: "43–46", color: "Weiß", stock: 50 },
        ],
      },
    },
  });

  // Demo reviews
  const reviews = [
    {
      rating: 5,
      title: "Absolut top!",
      body: "Die Grip Socks sind absolut genial. Kein einziges Mal verrutscht, auch nach 2 Stunden Training.",
      author: "Lena K.",
      verified: true,
      approved: true,
    },
    {
      rating: 5,
      title: "Nie wieder ohne",
      body: "Perfekter Halt im Schuh, super atmungsaktiv. Kaufe ich regelmäßig nach.",
      author: "Marco S.",
      verified: true,
      approved: true,
    },
    {
      rating: 4,
      title: "Sehr gut",
      body: "Qualität stimmt, Versand war schnell. Empfehlenswert.",
      author: "Tim R.",
      verified: true,
      approved: true,
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: { ...r, productId: product.id } });
  }

  // Demo discount codes
  await prisma.discountCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 20,
      maxUses: 100,
      active: true,
    },
  });

  await prisma.discountCode.upsert({
    where: { code: "SPORT5" },
    update: {},
    create: {
      code: "SPORT5",
      type: "FIXED",
      value: 5,
      minOrder: 30,
      active: true,
    },
  });

  console.log("✅ Seed erfolgreich abgeschlossen");
  console.log("👤 Admin: admin@donstore.de / admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
