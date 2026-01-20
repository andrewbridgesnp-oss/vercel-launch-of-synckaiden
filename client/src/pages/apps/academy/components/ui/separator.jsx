import React from "react";
import { cn } from "@/lib/utils";

export function Separator({ className, ...props }) {
  return <hr className={cn("my-2 border-border", className)} {...props} />;
}
