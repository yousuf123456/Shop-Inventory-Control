import React from "react";
import prisma from "@/app/libs/prismadb";
import { HistoryActionCard } from "./HistoryActionCard";
import Image from "next/image";

import { Paginate } from "./Paginate";

interface ActionsHistoryProps {
  product_sku: string | undefined;
  page: number | undefined;
}

export const ActionsHistory = async ({
  product_sku,
  page,
}: ActionsHistoryProps) => {
  const historyActions = await prisma.history.findMany({
    skip: (page || 0) * 30,
    where: {
      product_sku,
    },
    take: 30,
    orderBy: {
      id: "desc",
    },
  });

  const count = await prisma.history.count({
    where: {
      product_sku,
    },
  });

  if (!product_sku) {
    return (
      <div className="flex flex-col gap-16 items-center">
        <h1 className="mt-16 text-2xl text-center font-semibold text-zinc-500">
          Please Choose a Product SKU
        </h1>

        <Image
          alt="Choose Product SKU"
          src={"/illustrations/choose.svg"}
          width={250}
          height={250}
        />
      </div>
    );
  }

  if (!(historyActions.length > 0)) {
    return (
      <div className="flex flex-col gap-16 items-center">
        <h1 className="mt-16 text-2xl text-center font-semibold text-zinc-500">
          No History Was Found
        </h1>

        <Image
          alt="Choose Product SKU"
          src={"/illustrations/choose.svg"}
          width={250}
          height={250}
        />
      </div>
    );
  }

  const pages = Math.ceil(count / 30);

  return (
    <div className="flex flex-col gap-6 items-end">
      <div className="w-full">
        {historyActions.map((historyAction, i) => (
          <HistoryActionCard historyAction={historyAction} key={i} />
        ))}
      </div>

      {pages > 1 && <Paginate pages={pages} />}
    </div>
  );
};
