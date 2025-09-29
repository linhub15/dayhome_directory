import { LinkButton } from "@/components/ui/button";

export function Nav() {
  return (
    <div className="w-fit mx-auto">
      <nav>
        <div className="flex gap-4 py-2">
          <LinkButton variant="ghost" to="/">Home</LinkButton>
          <LinkButton variant="ghost" to="/directory">Directory</LinkButton>
        </div>
      </nav>
    </div>
  );
}
