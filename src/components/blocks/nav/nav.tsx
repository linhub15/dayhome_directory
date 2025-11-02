import { LinkButton } from "@/components/ui/button";

export function Nav() {
  return (
    <div className="mx-auto w-fit">
      <nav>
        <div className="flex gap-4 py-2">
          <LinkButton
            variant="ghost"
            to="/home"
            activeProps={{ className: "underline" }}
          >
            Home
          </LinkButton>
          <LinkButton
            variant="ghost"
            to="/info"
            activeProps={{ className: "underline" }}
          >
            Info
          </LinkButton>
          <LinkButton
            variant="ghost"
            to="/map"
            activeProps={{ className: "underline" }}
          >
            Map
          </LinkButton>
        </div>
      </nav>
    </div>
  );
}
