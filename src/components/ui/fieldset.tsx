import { ComponentProps } from "react";

function Field({ children }: ComponentProps<"div">) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {children}
    </div>
  );
}

export { Field };
