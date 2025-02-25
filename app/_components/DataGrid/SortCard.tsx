import { cn } from "@/lib/utils";
import React from "react";
import { HiArrowCircleUp } from "react-icons/hi";
import { getSearchParamsArray } from "../../_utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SortConfig, SortOption } from "@/app/_types";

interface SortCardProps {
  sortOption: SortOption;
  currentSortConfig: SortConfig | null;
}

export const SortCard: React.FC<SortCardProps> = ({
  sortOption,
  currentSortConfig,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const onSort = () => {
    const currentSortDir = Object.values(currentSortConfig || {})[0];
    const haveToResetSort = currentSortDir === -1;
    const searchParamsArray = getSearchParamsArray(searchParams, [
      "sortByField",
      "sortDir",
    ]);

    if (!haveToResetSort) {
      searchParamsArray.push(`sortByField=${sortOption.fieldName}`);
      searchParamsArray.push(`sortDir=${currentSortDir === 1 ? -1 : 1}`);
    }

    router.push(`${pathname}?${searchParamsArray.join("&")}`);
  };

  const currentlySortedByThisOption =
    currentSortConfig && currentSortConfig[sortOption.fieldName] !== undefined;

  return (
    <div
      onClick={onSort}
      className={cn(
        "flex gap-3 items-center transition-all px-3 py-1.5 rounded-sm w-fit bg-green-500 hover:bg-green-600 group cursor-pointer",
        currentlySortedByThisOption && "bg-green-600"
      )}
    >
      <p
        className={cn(
          "text-sm font-medium transition-all text-white group-hover:text-white",
          currentlySortedByThisOption && "text-white"
        )}
      >
        {sortOption.label}
      </p>

      <HiArrowCircleUp
        className={cn(
          "text-white group-hover:text-white group-hover:opacity-100 w-5 h-5 transition-all rounded-full",
          currentlySortedByThisOption && "opacity-100 text-white",
          currentlySortedByThisOption &&
            currentSortConfig[sortOption.fieldName] === -1 &&
            "rotate-180"
        )}
      />
    </div>
  );
};
