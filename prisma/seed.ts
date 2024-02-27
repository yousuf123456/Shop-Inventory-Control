import prisma from "../app/libs/prismadb";

async function main() {
  const store_products = await prisma.store_Product.findMany();
  store_products.map(async (storeProduct) => {
    await prisma.store_Product.update({
      where: {
        id: storeProduct.id,
      },
      data: {
        itemName: storeProduct.itemName.trim(),
      },
    });
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
