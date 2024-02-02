import { cn } from "@/lib/utils";
import React from "react";
import { HiArrowCircleUp } from "react-icons/hi";

interface SortCardProps {
  sort: {
    label: string;
    fieldName: string;
  };
  setServerSort: React.Dispatch<React.SetStateAction<{} | null>>;
  serverSort: { [key: string]: any } | null;
}

export const SortCard: React.FC<SortCardProps> = ({
  sort,
  setServerSort,
  serverSort,
}) => {
  const onSort = () => {
    if (serverSort !== null) {
      return setServerSort((prev) =>
        //@ts-ignore
        prev[sort.fieldName] === 1 ? { [sort.fieldName]: -1 } : null
      );
    }

    setServerSort({ [sort.fieldName]: 1 });
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
