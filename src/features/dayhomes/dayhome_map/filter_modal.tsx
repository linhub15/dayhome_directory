import { useForm } from "@tanstack/react-form";
import z from "@zod/zod";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ageGroup = [
  "infant",
  "toddler",
  "preschool",
  "kindergarten",
  "grade_school",
] as const;
type AgeGroupKey = (typeof ageGroup)[number];
const ageGroupsOptions = {
  infant: "Infant",
  toddler: "Toddler",
  preschool: "Preschool",
  kindergarten: "Kindergarten",
  grade_school: "Grade School",
};

const filterModalSearchSchema = z.object({
  onlyLicensed: z.boolean().optional(),
  ageGroups: z
    .object({
      infant: z.boolean(),
      toddler: z.boolean(),
      preschool: z.boolean(),
      kindergarten: z.boolean(),
      grade_school: z.boolean(),
    })
    .optional(),
});

type Filter = z.infer<typeof filterModalSearchSchema>;

type Props = {
  filters?: Filter;
  onOpenStart?: () => void;
  onFilterChange?: (filters?: Filter) => void;
};

function FilterModal(props: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      onlyLicensed: props.filters?.onlyLicensed ?? false,
      ageGroups: props.filters?.ageGroups ?? {
        infant: false,
        toddler: false,
        preschool: false,
        kindergarten: false,
        grade_school: false,
      },
    } satisfies Filter,
    onSubmit: ({ value }) => {
      if (
        !value.onlyLicensed
        && !Object.values(value.ageGroups).some((v) => v)
      ) {
        setOpen(false);
        return;
      }
      props.onFilterChange?.(value);
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(opening) => {
        props.onOpenStart?.();
        setOpen(opening);
        if (opening) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings2Icon />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex gap-8 items-center">
            <DialogTitle>Filters</DialogTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                props.onFilterChange?.();
                form.reset();
              }}
            >
              Clear
            </Button>
          </div>
        </DialogHeader>
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="onlyLicensed">
            {(field) => (
              <div className="flex items-center gap-3">
                <Label className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-blue-50">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(e) => field.setValue(!!e)}
                    defaultChecked
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Only show licensed facilities
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Licensed facilities can be ineligible for subsidies.
                    </p>
                  </div>
                </Label>
              </div>
            )}
          </form.Field>

          <form.Field name="ageGroups">
            {(field) => (
              <div>
                <div className="flex items-center gap-4 flex-wrap">
                  {Object.keys(ageGroupsOptions).map((key) => (
                    <Label key={key}>
                      <Badge
                        className="cursor-pointer select-none"
                        size="lg"
                        variant={
                          field.state.value[key as AgeGroupKey]
                            ? "default"
                            : "outline"
                        }
                      >
                        <Checkbox
                          checked={field.state.value[key as AgeGroupKey]}
                          onCheckedChange={(e) =>
                            field.handleChange((prev) => ({
                              ...prev,
                              [key]: e,
                            }))
                          }
                        />
                        {ageGroupsOptions[key as AgeGroupKey]}
                      </Badge>
                    </Label>
                  ))}
                </div>
              </div>
            )}
          </form.Field>

          <div className="pt-4">
            <Button type="submit" className="w-full" variant="default">
              Apply
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { type AgeGroupKey, FilterModal, filterModalSearchSchema };
