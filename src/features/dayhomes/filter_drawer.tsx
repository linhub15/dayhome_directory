import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

export const filterSearchParams = z.object({
  name: z.string().trim().toLowerCase().optional(),
});

export type FilterSearchParams = z.infer<typeof filterSearchParams>;

export function FilterDrawer(props: { initialValues?: FilterSearchParams }) {
  const [values, setValues] = useState<FilterSearchParams | undefined>(
    props.initialValues,
  );

  return (
    <div className="relative h-30 bg-white">
      <Drawer>
        <DrawerTrigger asChild>
          <div className="flex items-center fixed left-0 bottom-0 h-30 w-full text-auto border-t">
            <div className="max-w-lg mx-auto">
              <button className="rounded border px-4 py-2" type="button">
                Search
              </button>
              <span>{values?.name}</span>
            </div>
          </div>
        </DrawerTrigger>

        <DrawerContent className="bg-white">
          <DrawerHeader>
            <DrawerTitle>Search and Filter</DrawerTitle>
          </DrawerHeader>
          <div className="max-w-md mx-auto">
            <input
              className="border rounded p-2"
              type="text"
              value={values?.name}
              onChange={(e) =>
                setValues({
                  name: e.target.value.toLocaleLowerCase().trim(),
                })}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Link
                className="rounded bg-green-300 size-fit mx-auto px-4 py-2"
                to="/"
                search={{ ...values }}
              >
                Apply
              </Link>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
