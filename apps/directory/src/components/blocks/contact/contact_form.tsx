import { useState } from "react";
import { Button } from "@dayhome/ui/button";
import { Card, CardContent } from "@dayhome/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@dayhome/ui/field";
import { Input } from "@dayhome/ui/input";
import { Label } from "@dayhome/ui/label";
import { RadioGroup, RadioGroupItem } from "@dayhome/ui/radio-group";
import { Textarea } from "@dayhome/ui/textarea";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Card>
      <CardContent>
        <form
          method="POST"
          action="https://formowl.dev/api/@/x6Tytw"
          onSubmit={(e) => {
            if (submitting) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            setSubmitting(true);
          }}
        >
          <input name="_honey_pot" style={{ display: "none" }} />
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Contact Us</FieldLegend>
              <FieldDescription>
                <span className="block">
                  Hey parents, what information do you want to see?
                </span>
                <span className="block">
                  Are you a childcare provider? Let's get you listed.
                </span>
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <RadioGroup defaultValue="parent" name="user_type">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent">I am a Parent</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="provider" id="provider" />
                      <Label htmlFor="provider">
                        I am a Childcare Provider
                      </Label>
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
