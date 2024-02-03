import prisma from "../app/libs/prismadb";

async function main() {
  await prisma.shop_Product.updateMany({
    data: {
      stockUnit: "normal",
    },
  });

  await prisma.store_Product.updateMany({
    data: {
      stockUnit: "normal",
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
