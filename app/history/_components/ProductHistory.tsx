import React from "react";

import Image from "next/image";
import { getProductHistory } from "../_serverFn/getProductHistory";
import { Paginate } from "./Paginate";
import { HistoryActionCard } from "./HistoryActionCard";

interface ProductHistoryProps {
  page: number;
  product_SKU: string | undefined;
}

export const ProductHistory: React.FC<ProductHistoryProps> = async ({
  page,
  product_SKU,
}) => {
  if (!product_SKU) {
    return (
      <div className="flex flex-col gap-16 items-center">
        <h1 className="mt-16 text-2xl text-center font-semibold text-zinc-600">
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

  const { productHistory, totalCount } = await getProductHistory(
    product_SKU,
    page
  );

  if (!(productHistory.length > 0)) {
    return (
      <div className="flex flex-col gap-16 items-center">
        <h1 className="mt-16 text-2xl text-center font-semibold text-zinc-600">
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

  const numOfPages = Math.ceil(totalCount / 30);

  return (
    <div className="flex flex-col gap-6 items-end">
      <div className="w-full">
        {productHistory.map((history, i) => (
          <HistoryActionCard key={i} history={history} />
        ))}
      </div>

      <Paginate pages={numOfPages} />
    </div>
  );
};
