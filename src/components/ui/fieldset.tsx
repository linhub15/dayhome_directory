import type { ComponentProps } from "react";

/** @deprecated use FieldSet from field.tsx */
function Field({ children }: ComponentProps<"div">) {
  return <div className="flex flex-col gap-2 w-full">{children}</div>;
}

export { Field };
