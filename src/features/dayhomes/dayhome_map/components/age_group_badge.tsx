import { Badge } from "@/components/ui/badge.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

export function AgeGroupBadge({ ageGroup }: { ageGroup: string }) {
  const ageGroupsMap: Record<string, string> = {
    infants: "Under 19 months",
    toddlers: "19 months to 3 years old",
    preschool: "Ages 3 to 4",
    kindergarten: "Ages 4 to 6",
    gradeschool: "Ages 6 to 12",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge className="capitalize" variant="secondary">
          {ageGroup}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        {ageGroupsMap[ageGroup] || "Age group information"}
      </PopoverContent>
    </Popover>
  );
}
