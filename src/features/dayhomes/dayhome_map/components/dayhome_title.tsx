export function DayhomeTitle({
  name,
  agencyName,
}: {
  name: string;
  agencyName?: string | null;
}) {
  return (
    <div className="flex flex-col">
      <h1>{name}</h1>
      {agencyName && (
        <span className="text-sm text-muted-foreground">{agencyName}</span>
      )}
    </div>
  );
}
