import { Building2Icon, HouseHeartIcon } from "lucide-react";

export function DayhomeTitle({
  name,
  agencyName,
  type,
}: {
  name: string;
  agencyName?: string | null;
  type?: "dayhome" | "facility";
}) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        {type === "dayhome" ? (
          <div title="Dayhome">
            <HouseHeartIcon className="size-3.5 text-slate-500" />
          </div>
        ) : (
          <div title="Daycare">
            <Building2Icon className="size-3.5 text-slate-500" />
          </div>
        )}
        <h1> {name}</h1>
      </div>
      {agencyName && (
        <span className="text-sm text-muted-foreground">{agencyName}</span>
      )}
    </div>
  );
}
