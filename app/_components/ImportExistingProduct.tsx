"use client";
import React, { useState } from "react";

import { useSearchSKU } from "@/app/_hooks";
import { Input } from "@/components/ui/input";

import debounce from "debounce";
import { Button } from "@/components/ui/button";
import { getSearchParamsArray } from "@/app/_utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ImportExistingProduct = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [product_SKU, setProduct_SKU] = useState(
    searchParams.get("product_SKU") || ""
  );
  const [focused, setFocused] = useState(false);

  const { searchSKU, searchResults } = useSearchSKU();

  const router = useRouter();

  const onEdit = () => {
    const searchParamsArray = getSearchParamsArray(searchParams, [
      "product_SKU",
    ]);

    searchParamsArray.push(`product_SKU=${product_SKU}`);

    router.push(`${pathname}?${searchParamsArray.join("&")}`);
  };

  const onCreateNew = () => {
    setProduct_SKU("");
    const searchParamsArray = getSearchParamsArray(searchParams, [
      "product_SKU",
    ]);

    // If there is any old searchParams in the url
    if (searchParamsArray.length > 0)
      return router.push(`${pathname}?${searchParamsArray}`);

    router.push(`${pathname}`);
  };

  return (
    <div className="flex justify-center gap-6">
      <div className="relative">
        <Input
          value={product_SKU}
          className="w-80"
          placeholder="Enter Product SKU"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 500)}
          onChange={(e) => {
            debounce(() => searchSKU(e.target.value), 500)();

            setProduct_SKU(e.target.value);
          }}
        />

        {searchResults.length > 0 && focused && (
          <div className="absolute inset-x-0 top-[110%] shadow bg-white p-3 max-h-64 overflow-y-auto">
            {searchResults.map((result, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-sm hover:bg-neutral-100"
                onClick={() => setProduct_SKU(result.product_SKU)}
              >
                <p className="text-sm font-nunito text-black ">
                  {result.product_SKU}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={onEdit}
        disabled={product_SKU.length === 0}
      >
        Import Product
      </Button>

      <Button type="button" onClick={onCreateNew} variant={"secondary"}>
        Clear
      </Button>
    </div>
  );
};
