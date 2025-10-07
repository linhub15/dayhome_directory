import { useQuery } from "@tanstack/react-query";
import { DayhomeListCard } from "./dayhome_list_card";
import { useServerFn } from "@tanstack/react-start";
import { listDayhomesFn } from "./list_dayhomes.fn";
import { Link } from "@tanstack/react-router";
import { dayhomeKeys } from "../query_keys";

type Props = { filters: { name?: string } };

export function DayhomeList({ filters }: Props) {
  const fn = useServerFn(listDayhomesFn);

  const { data } = useQuery({
    queryKey: dayhomeKeys.list(filters),
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
    </div>
  );
}
