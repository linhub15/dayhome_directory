import z from "@zod/zod";
import { customAlphabet } from "nanoid";

export const pattern = /^[0-9A-Za-z]+$/;

const DEFAULT_SIZE = 10;

const nanoidSchema = z.nanoid({ pattern }).length(DEFAULT_SIZE);

type Nanoid = z.infer<typeof nanoidSchema>;

// Collision Calculator https://zelark.github.io/nano-id-cc/
export function nanoid(size: number = DEFAULT_SIZE): Nanoid {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    size,
  )();
}
