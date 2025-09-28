import { useQuery } from "@tanstack/react-query";
import { DayhomeListCard } from "./dayhome_list_card";
import { FilterDrawer } from "../filter_drawer";
import { useServerFn } from "@tanstack/react-start";
import { listDayhomesFn } from "../list_dayhomes.fn";
import { Link } from "@tanstack/react-router";

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
          <Link
            className="block"
            to="/directory/$id"
            params={{ id: dayhome.id }}
            key={dayhome.name}
          >
            <DayhomeListCard
              {...dayhome}
            />
          </Link>
        ))}
      </div>
      <FilterDrawer initialValues={filters} />
    </div>
  );
}
