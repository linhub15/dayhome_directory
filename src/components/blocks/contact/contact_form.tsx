import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio_group.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <CardContent>
        <form
          method="POST"
          action="https://formowl.dev/api/@/x6Tytw"
          onSubmit={() => {
            setSubmitting(true);
          }}
        >
          <input name="_honey_pot" style={{ display: "none" }} />
          <FieldGroup>
            <FieldSet disabled={submitting}>
              <FieldLegend>Contact Us</FieldLegend>
              <FieldDescription>
                How can make this better for you?
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <RadioGroup defaultValue="parent" name="user_type">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent">Parent</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="comfortable" id="provider" />
                      <Label htmlFor="provider">Childcare Provider</Label>
                    </div>
                  </RadioGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email (required)</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@hotmail.com"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="message">Message</FieldLabel>
                  <Textarea
                    id="message"
                    name="message"
                    rows={10}
                    placeholder="Write your message here..."
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Field orientation="horizontal">
              <Button className="ml-auto" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
