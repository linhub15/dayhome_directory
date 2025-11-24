import { Nav } from "@/components/blocks/nav/nav.tsx";

export function AppLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />

      <div className="w-full max-w-xl px-2 sm:mx-auto my-4 sm:my-8">
        {props.children}
      </div>
    </>
  );
}
