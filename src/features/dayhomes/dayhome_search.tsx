import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import z from "@zod/zod";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export const filterSearchParams = z.object({
  postalCode: z.string().trim().max(6).optional(),
});

export type Props = {
  postalCode?: string;
};

export function DayhomeSearch(props: { value?: string }) {
  const [value, setValue] = useState(props.value);
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate({
      to: ".",
      search: {},
    });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }}
      >
        <div className="flex gap-1">
          <Input
            className="bg-background w-60"
            type="search"
            placeholder="Postal Code e.g. T5A0A7"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            maxLength={6}
          />

          <Button variant="outline" type="submit">
            <SearchIcon />
          </Button>
        </div>
      </form>
    </div>
  );
}
