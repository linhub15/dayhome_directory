import { useQuery } from "@tanstack/react-query";
import { DayhomeCard } from "./dayhome_card";
import { FilterDrawer } from "./filter_drawer";
import { useServerFn } from "@tanstack/react-start";
import { listDayhomesFn } from "./list_dayhomes.fn";

type Props = { filters: { name?: string } };

export function DayhomeList({ filters }: Props) {
  const fn = useServerFn(listDayhomesFn);
  const { data } = useQuery({
    queryKey: ["dayhomes", filters.name],
    queryFn: () => fn({ data: filters }),
  });

  return (
    <div>
      <div className="p-2 space-y-4">
        {data?.map((dayhome) => (
          <DayhomeCard
            key={dayhome.name}
            {...dayhome}
          />
        ))}
      </div>
      <FilterDrawer initialValues={filters} />
    </div>
  );
}
