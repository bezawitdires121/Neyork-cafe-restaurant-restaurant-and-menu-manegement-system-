import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "New York Cafe & Restaurant",
      description: "A luxury dining experience in Bahir-Dar.",
      exchangeRate: 130.0, // update to real ETB/USD rate later via admin panel
      openingHours: { mon: "8:00-22:00", tue: "8:00-22:00", wed: "8:00-22:00", thu: "8:00-22:00", fri: "8:00-23:00", sat: "8:00-23:00", sun: "8:00-22:00" },
      socialLinks: { instagram: "", tiktok: "", facebook: "" },
      bankAccounts: [],
    },
  });

  // 2. Floors
  const firstFloor = await prisma.floor.create({
    data: { name: "First Floor", order: 1, restaurantId: restaurant.id },
  });
  const secondFloor = await prisma.floor.create({
    data: { name: "Second Floor", order: 2, restaurantId: restaurant.id },
  });

  // 3. Tables (3 per floor to start)
  for (const floor of [firstFloor, secondFloor]) {
    for (let i = 1; i <= 3; i++) {
      await prisma.table.create({
        data: { number: String(i), capacity: 4, floorId: floor.id },
      });
    }
  }

  // 4. Categories
  const categoryNames = [
    { en: "Breakfast", am: "ቁርስ" },
    { en: "Lunch", am: "ምሳ" },
    { en: "Coffee", am: "ቡና" },
    { en: "Desserts", am: "ጣፋጭ" },
  ];
  for (let i = 0; i < categoryNames.length; i++) {
    await prisma.category.create({
      data: { nameEn: categoryNames[i].en, nameAm: categoryNames[i].am, order: i },
    });
  }

  // 5. Admin user
  const adminPassword = "ChangeMe123!"; // CHANGE after first login
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.create({
    data: { username: "admin", passwordHash, role: "ADMIN" },
  });

  // 6. Cashier user
  const cashierPassword = "ChangeMe456!"; // CHANGE after first login
  const cashierHash = await bcrypt.hash(cashierPassword, 12);
  await prisma.user.create({
    data: { username: "cashier", passwordHash: cashierHash, role: "CASHIER" },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin / ChangeMe123!");
  console.log("Cashier login: cashier / ChangeMe456!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });