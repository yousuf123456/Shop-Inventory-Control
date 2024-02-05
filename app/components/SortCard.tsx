import { cn } from "@/lib/utils";
import React from "react";
import { HiArrowCircleUp } from "react-icons/hi";
import { getSearchParamsArray } from "../utils/getSearchParamsArray";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SortCardProps {
  sort: {
    label: string;
    fieldName: string;
  };
  serverSort: { [key: string]: any } | null;
}

export const SortCard: React.FC<SortCardProps> = ({ sort, serverSort }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const onSort = () => {
    const serverSortVal = Object.values(serverSort || {})[0];
    const removeSort = serverSortVal === -1;
    const searchParamsArray = getSearchParamsArray(searchParams, [
      "sortBy",
      "dir",
    ]);

    if (!removeSort) {
      searchParamsArray.push(`sortBy=${sort.fieldName}`);
      searchParamsArray.push(`dir=${serverSortVal === 1 ? -1 : 1}`);
    }

    router.push(`${pathname}?${searchParamsArray.join("&")}`);
  };

  const thisSortSelected =
    serverSort !== null && serverSort[sort.fieldName] !== undefined;

  return (
    <div
      onClick={onSort}
      className={cn(
        "flex gap-3 items-center transition-all px-3 py-1.5 rounded-sm w-fit bg-blue-400 hover:bg-blue-600 group cursor-pointer",
        thisSortSelected && "bg-blue-600"
      )}
    >
      <p
        className={cn(
          "text-sm font-medium transition-all text-white group-hover:text-white",
          thisSortSelected && "text-white"
        )}
      >
        {sort.label}
      </p>

      <HiArrowCircleUp
        className={cn(
          "text-white group-hover:text-white group-hover:opacity-100 w-5 h-5 transition-all rounded-full",
          thisSortSelected && "opacity-100 text-white",
          thisSortSelected &&
            //@ts-ignore
            serverSort[sort.fieldName] === -1 &&
            "rotate-180"
        )}
      />
    </div>
  );
};
