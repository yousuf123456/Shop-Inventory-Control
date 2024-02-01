import prisma from "../app/libs/prismadb";

async function main() {
  await prisma.shop_Product.updateMany({
    where: {
      bike_rikshawName: undefined,
    },
    data: {
      bike_rikshawName: "",
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
