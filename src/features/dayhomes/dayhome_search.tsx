import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

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
      search: { postalCode: value?.trim() },
    });
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }}
      >
        <div className="flex gap-3">
          <Input
            className="bg-background"
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

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-search-icon lucide-search"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}
