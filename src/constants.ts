import { Address } from "viem";

export const ADDRESSES = {
  EXECUTOR_PLUGIN: {
    PROD: "0xeC4181eE959e47f72e9cC60274fBE53D68949e47" as Address,
    DEV: "0xb92929d03768a4F8D69552e15a8071EAf8E684ed" as Address,
  },
  MULTISEND: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D" as Address,
} as const;
