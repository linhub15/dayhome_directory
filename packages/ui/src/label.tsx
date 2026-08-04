import type { ComponentProps } from "react";

import { cn } from "./cn.ts";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // The association may be supplied through htmlFor or by nesting the control.
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
