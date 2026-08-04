import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon, MailIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar.tsx";
import { Badge } from "./badge.tsx";
import { Button } from "./button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.tsx";
import { Checkbox } from "./checkbox.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field.tsx";
import { Input } from "./input.tsx";
import { Label } from "./label.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.tsx";
import { RadioGroup, RadioGroupItem } from "./radio-group.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select.tsx";
import { Separator } from "./separator.tsx";
import { Textarea } from "./textarea.tsx";
import { Toaster } from "./toaster.tsx";
import { Toggle } from "./toggle.tsx";

const meta = {
  title: "UI/Component catalog",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonsAndBadges: Story = {
  render: () => (
    <div className="flex max-w-xl flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button size="icon" aria-label="Email">
        <MailIcon />
      </Button>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
};

export const AvatarAndToggle: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
        <AvatarFallback>DH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>DH</AvatarFallback>
      </Avatar>
      <Toggle aria-label="Toggle bold">
        <BoldIcon />
      </Toggle>
      <Toggle variant="outline" pressed aria-label="Toggle bold pressed">
        <BoldIcon />
      </Toggle>
    </div>
  ),
};

export const CardExample: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Dayhome profile</CardTitle>
        <CardDescription>Review the details before publishing.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Draft</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          A warm, play-based program for children ages 2–5.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="outline">Cancel</Button>
        <Button>Publish</Button>
      </CardFooter>
    </Card>
  ),
};

export const FormControls: Story = {
  render: () => (
    <div className="grid w-[360px] gap-6">
      <div className="grid gap-2">
        <Label htmlFor="storybook-name">Program name</Label>
        <Input id="storybook-name" placeholder="Little Sprouts" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="storybook-notes">Notes</Label>
        <Textarea
          id="storybook-notes"
          placeholder="Tell families what makes your care special."
        />
      </div>
      <Label>
        <Checkbox defaultChecked /> Accepting new families
      </Label>
      <FieldSet>
        <FieldLegend>Preferred contact</FieldLegend>
        <RadioGroup defaultValue="email">
          <Field orientation="horizontal">
            <RadioGroupItem value="email" id="storybook-email" />
            <FieldLabel htmlFor="storybook-email">Email</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="phone" id="storybook-phone" />
            <FieldLabel htmlFor="storybook-phone">Phone</FieldLabel>
          </Field>
          <Field orientation="horizontal" data-disabled="true">
            <RadioGroupItem value="text" id="storybook-text" disabled />
            <FieldLabel htmlFor="storybook-text">Text message</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <Select defaultValue="toddler">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose an age group" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Age groups</SelectLabel>
            <SelectItem value="infant">Infant</SelectItem>
            <SelectItem value="toddler">Toddler</SelectItem>
            <SelectSeparator />
            <SelectItem value="preschool">Preschool</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const FieldStates: Story = {
  render: () => (
    <FieldGroup className="w-[420px]">
      <Field>
        <FieldLabel htmlFor="storybook-email-address">Email address</FieldLabel>
        <FieldContent>
          <Input
            id="storybook-email-address"
            defaultValue="not-an-email"
            aria-invalid
          />
          <FieldDescription>
            We only use this for account notices.
          </FieldDescription>
          <FieldError>Enter a valid email address.</FieldError>
        </FieldContent>
      </Field>
      <FieldSeparator>or</FieldSeparator>
      <Field orientation="horizontal">
        <Checkbox id="storybook-updates" />
        <FieldContent>
          <FieldTitle>Product updates</FieldTitle>
          <FieldDescription>
            Receive occasional feature announcements.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
};

export const SeparatorExample: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-4 text-sm">
      <span>Profile</span>
      <Separator orientation="vertical" />
      <span>Availability</span>
      <Separator orientation="vertical" />
      <span>Contact</span>
    </div>
  ),
};

export const PopoverExample: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-medium">Availability</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Two full-time spaces are currently open.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const DialogExample: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish this profile?</DialogTitle>
          <DialogDescription>
            Families will be able to find it in the directory.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const DrawerExample: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Edit availability</DrawerTitle>
            <DrawerDescription>
              Update the spaces shown to families.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const ToastExample: Story = {
  render: () => (
    <>
      <Button onClick={() => toast.success("Profile saved")}>Show toast</Button>
      <Toaster />
    </>
  ),
};
