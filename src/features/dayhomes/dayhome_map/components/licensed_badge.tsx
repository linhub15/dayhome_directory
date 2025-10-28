import { CircleCheckIcon, CircleQuestionMarkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

export function LicensedBadge({ isLicensed }: { isLicensed: boolean }) {
  return isLicensed ? (
    <Badge>
      <CircleCheckIcon />
      Licensed
    </Badge>
  ) : (
    <Popover>
      <PopoverTrigger>
        <Badge variant="outline">
          <CircleQuestionMarkIcon />
          Private
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="mx-2">
        <div className="px-1 text-sm">
          <p>
            Private providers are unlicensed and may be ineligible for funding.
          </p>
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://www.alberta.ca/about-child-care-in-alberta#accordion4261"
          >
            Unlicensed child care in Alberta
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
