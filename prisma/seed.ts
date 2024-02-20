import prisma from "../app/libs/prismadb";

async function main() {
  await prisma.shop_Product.updateMany({
    where: {
      stockUnit: "kilogram",
    },
    data: {
      stockUnit: "kg",
    },
  });
  await prisma.sale.updateMany({
    data: {
      profit: 0,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
