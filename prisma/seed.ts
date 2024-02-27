import prisma from "../app/libs/prismadb";

async function main() {
  const shop_products = await prisma.shop_Product.findMany();

  shop_products.map(async (shopProduct) => {
    const id = shopProduct.id;

    await prisma.shop_Product.update({
      where: {
        id: shopProduct.id,
      },
      data: {
        ...shopProduct,
        itemName: shopProduct.itemName.trim(),
      },
    });
  });
  const store_products = await prisma.store_Product.findMany();
  store_products.map(async (storeProduct) => {
    await prisma.store_Product.update({
      where: {
        id: storeProduct.id,
      },
      data: {
        ...storeProduct,
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
