export function DayhomeTitle({
  name,
  agencyName,
}: {
  name: string;
  agencyName?: string | null;
}) {
  return (
    <div className="flex flex-col">
      <span>{name}</span>
      {agencyName && (
        <span className="text-sm text-muted-foreground">{agencyName}</span>
      )}
    </div>
  );
}
