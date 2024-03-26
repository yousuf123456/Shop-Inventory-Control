import { History } from "@prisma/client";
import prisma from "../app/libs/prismadb";

async function main() {
  const history = [
    {
      actionType: "sale_shop",
      product_sku: "test-test-test",
      price: 100,
      numOfUnits: 15,
    },
    {
      actionType: "purchase_shop",
      product_sku: "test-test-test",
      price: 100,
      numOfUnits: 15,
    },
    {
      actionType: "storeTransfer",
      product_sku: "test-test-test",
      price: 0,
      numOfUnits: 15,
    },
    {
      actionType: "shopTransfer",
      product_sku: "test-test-test",
      price: 0,
      numOfUnits: 15,
    },
  ] as History[];

  await prisma.history.deleteMany();
  await prisma.history.createMany({ data: history });
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
