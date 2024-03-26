"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export const SelectProduct = () => {
  const [open, setOpen] = useState(false);
  const [product_SKU, setProduct_SKU] = useState("");
  const [productSKUAutoCompletes, setProductSKUAutoCompletes] = useState<
    { product_SKU: string }[]
  >([]);

  useEffect(() => {
    if (!product_SKU) return;

    axios
      .post("../../api/getSKUAutoCompletes", {
        query: product_SKU,
        toStore: false,
      })
      .then((res) => setProductSKUAutoCompletes(res.data))
      .catch((e) => console.log(e));
  }, [product_SKU]);

  const onAutocompleteClick = (autocomplete: string) => {
    setProduct_SKU(autocomplete);
  };

  const router = useRouter();
  const onExtractHistory = () => {
    router.push(`/history?product_sku=${product_SKU}`);
  };

  return (
    <div className="w-full justify-center flex">
      <div className="relative flex gap-8">
        <form autoComplete="off">
          <Input
            className="w-80"
            autoComplete="off"
            value={product_SKU}
            placeholder="Enter Product SKU"
            onChange={(e) => setProduct_SKU(e.target.value)}
            onFocus={(e) => setOpen(true)}
            onBlur={(e) =>
              setTimeout(() => {
                setOpen(false);
              }, 200)
            }
          />
        </form>

        {open && productSKUAutoCompletes.length > 0 && (
          <div className="absolute flex flex-col gap-0 p-1 top-14 left-0 w-80 h-72 overflow-y-auto bg-white shadow-lg rounded-md z-[99999]">
            {productSKUAutoCompletes.map((autoComplete, i) => (
              <div
                key={i}
                onClick={() => onAutocompleteClick(autoComplete.product_SKU)}
                className="px-4 py-2 rounded-sm hover:bg-neutral-100"
              >
                <p className=" font-nunito text-black ">
                  {autoComplete.product_SKU}
                </p>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          disabled={!product_SKU}
          onClick={onExtractHistory}
        >
          Extract History
        </Button>
      </div>
    </div>
  );
};
