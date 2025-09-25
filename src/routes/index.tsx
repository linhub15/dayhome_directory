import { DayhomeCard } from "@/features/dayhomes/dayhome_card";
import { listDayhomesFn } from "@/features/dayhomes/list_dayhomes.fn";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const fn = useServerFn(listDayhomesFn);

  const { data } = useQuery({
    queryKey: ["dayhomes"],
    queryFn: () => fn(),
  });

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center text-xl py-2">Day Home Directory</h1>
      <div className="p-2 space-y-4">
        {data?.map((dayhome) => (
          <DayhomeCard
            key={dayhome.name}
            {...dayhome}
          />
        ))}
      </div>
    </div>
  );
}
