import { useState } from "react";

import axios from "axios";
import { useSearchParams } from "next/navigation";

export const useSearchSKU = () => {
  const [searchResults, setSearchResults] = useState<{ product_SKU: string }[]>(
    []
  );

  const location = useSearchParams().get("location");

  const searchSKU = (query: string) => {
    if (query.length === 0) return;

    const searchedSKUArray = searchResults.map((res) => res.product_SKU);
    if (searchedSKUArray.includes(query)) return; //If vendor selects a specific SKU, there is no need to search

    axios
      .post("../../api/getSKUAutoCompletes", { query, location })
      .then((res) => setSearchResults(res.data))
      .catch((e) => console.log(e));
  };

  return { searchResults, searchSKU };
};
