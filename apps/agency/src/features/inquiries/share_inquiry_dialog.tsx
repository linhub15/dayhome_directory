import { Button, buttonVariants } from "@dayhome/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dayhome/ui/dialog";
import { Input } from "@dayhome/ui/input";
import {
  CheckIcon,
  Code2Icon,
  CopyIcon,
  ExternalLinkIcon,
  Share2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";

export function ShareInquiryDialog({ tenantSlug }: { tenantSlug: string }) {
  const relativePath = "/inquiry/" + encodeURIComponent(tenantSlug);
  const [formUrl, setFormUrl] = useState(relativePath);
  const [copied, setCopied] = useState<"link" | "embed" | null>(null);

  useEffect(() => {
    setFormUrl(new URL(relativePath, window.location.origin).href);
  }, [relativePath]);

  const embedCode = [
    "<iframe",
    '  src="' + formUrl + '"',
    '  title="Childcare inquiry form"',
    '  loading="lazy"',
    '  style="width:100%;min-height:900px;border:0;border-radius:16px;"',
    "></iframe>",
  ].join("\n");

  async function copy(value: string, type: "link" | "embed") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ size: "lg" })}>
        <Share2Icon size={15} /> Share inquiry form
      </DialogTrigger>
      <DialogContent className="max-h-[min(--spacing(180),calc(100vh_---spacing(8)))] max-w-xl overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="border-b px-6 pt-6 pb-5 text-left">
          <DialogTitle>Share your inquiry form</DialogTitle>
          <DialogDescription>
            Send families a direct link or add the form to your existing
            website.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 px-6 pb-6">
          <section className="grid gap-3 pt-1">
            <div className="flex items-center gap-2">
              <ExternalLinkIcon className="text-primary" size={17} />
              <h3 className="m-0 text-sm font-medium">Direct link</h3>
            </div>
            <p className="m-0 text-sm leading-normal text-muted-foreground">
              Use this in emails, texts, social profiles, or a button on your
              website.
            </p>
            <div className="flex gap-2 max-sm:grid">
              <Input
                className="min-h-10 min-w-0 flex-1 text-muted-foreground"
                aria-label="Inquiry form link"
                value={formUrl}
                readOnly
              />
              <Button
                className="min-h-10"
                type="button"
                variant="outline"
                onClick={() => void copy(formUrl, "link")}
              >
                {copied === "link" ? <CheckIcon /> : <CopyIcon />}
                {copied === "link" ? "Copied" : "Copy link"}
              </Button>
              <Button className="min-h-10" asChild>
                <a href={relativePath} target="_blank" rel="noreferrer">
                  View <ExternalLinkIcon />
                </a>
              </Button>
            </div>
          </section>

          <section className="grid gap-3 border-t pt-5">
            <div className="flex items-center gap-2">
              <Code2Icon className="text-primary" size={17} />
              <h3 className="m-0 text-sm font-medium">Embed on your website</h3>
            </div>
            <p className="m-0 text-sm leading-normal text-muted-foreground">
              In your website builder, add an <strong>Embed</strong>,{" "}
              <strong>Custom code</strong>, or <strong>HTML</strong> block, then
              paste this snippet. It automatically fills the available width and
              works on phones.
            </p>
            <pre className="m-0 overflow-x-auto rounded-xl bg-foreground p-4 text-xs leading-5 text-background">
              <code>{embedCode}</code>
            </pre>
            <Button
              className="min-h-10 w-fit max-sm:w-full"
              type="button"
              variant="outline"
              onClick={() => void copy(embedCode, "embed")}
            >
              {copied === "embed" ? <CheckIcon /> : <CopyIcon />}
              {copied === "embed" ? "Embed code copied" : "Copy embed code"}
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
