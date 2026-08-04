import { Button } from "@dayhome/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dayhome/ui/card";
import { useState, type ReactNode } from "react";

import type { createDayhomeAuthClient } from "./client.ts";

export type DayhomeAuthClient = ReturnType<typeof createDayhomeAuthClient>;

export function AuthPage({
  eyebrow = "Dayhome Flow",
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#e8f3ed_0,transparent_42%)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-[#275f50] text-lg font-black text-white">
            D
          </div>
          <p className="m-0 text-xs font-bold tracking-[0.14em] text-[#4d806f] uppercase">
            {eyebrow}
          </p>
        </div>
        <Card className="border-[#d8e4dd] shadow-[0_22px_60px_rgba(32,73,59,0.10)]">
          <CardHeader>
            <CardTitle className="font-[Manrope,sans-serif] text-2xl tracking-[-0.03em]">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer ? (
            <CardFooter className="justify-center border-t text-sm text-muted-foreground">
              {footer}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </main>
  );
}

export function GoogleAuthButton({
  authClient,
  callbackURL,
  label = "Continue with Google",
}: {
  authClient: DayhomeAuthClient;
  callbackURL: string;
  label?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const continueWithGoogle = async () => {
    setPending(true);
    setError(undefined);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      if (result.error)
        setError(result.error.message ?? "Google sign-in failed");
    } catch {
      setError("Google sign-in could not be started. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid gap-3">
      <Button
        className="h-11 w-full bg-white text-[#263a33] shadow-sm ring-1 ring-[#d8e1dc] hover:bg-[#f7faf8]"
        type="button"
        disabled={pending}
        onClick={continueWithGoogle}
      >
        <GoogleMark />
        {pending ? "Opening Google…" : label}
      </Button>
      {error ? (
        <p className="m-0 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AccountSummary({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
      {image ? (
        <img className="size-10 rounded-xl object-cover" src={image} alt="" />
      ) : (
        <span className="grid size-10 place-items-center rounded-xl bg-[#dcebe3] font-bold text-[#275f50]">
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="grid min-w-0">
        <strong className="truncate text-sm">{name}</strong>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </span>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.4L15.4 17c-.9.6-2.1 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H3v2.7A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.3 13.8A6 6 0 0 1 6 12c0-.6.1-1.2.3-1.8V7.5H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.5l3.3-2.7Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9 5.5l3.3 2.7C7.1 7.8 9.4 6 12 6Z"
      />
    </svg>
  );
}
