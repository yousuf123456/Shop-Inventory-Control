import React from "react";

import Link from "next/link";
import { cn } from "../../_utils/cn";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import styled from "@mui/material/styles/styled";
import tooltipClasses from "@mui/material/Tooltip/tooltipClasses";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip/Tooltip";

interface DatagridActionsProps {
  actions: {
    label: string;
    href?: string;
    className?: string;
    onClick?: (params: any) => any;
    Icon: IconType | LucideIcon;
  }[];
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingTop: "6px",
    paddingBottom: "6px",
    fontFamily: "var(--font-roboto)",
    boxShadow: theme.shadows[2],
    backgroundColor: "white",
    color: "#1e1b4b",
    fontSize: 12.5,
  },
}));

export const DatagridActions: React.FC<DatagridActionsProps> = ({
  actions,
}) => {
  return (
    <div className="rounded-sm flex gap-4 items-center justify-center w-full">
      {actions.map(({ label, Icon, className, onClick, href }, i) => (
        <LightTooltip key={i} title={label} placement="top" className="top-0">
          {href ? (
            <Link href={href}>
              <div onClick={onClick}>
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] text-blue-500 cursor-pointer transition-all hover:opacity-60",
                    className
                  )}
                />
              </div>
            </Link>
          ) : (
            <div onClick={onClick}>
              <Icon
                className={cn(
                  "w-5 h-5 text-blue-500 cursor-pointer transition-all hover:opacity-60",
                  className
                )}
              />
            </div>
          )}
        </LightTooltip>
      ))}
    </div>
  );
};
