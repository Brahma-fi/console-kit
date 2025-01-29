import { ethers } from "ethers";
import { Address } from "viem";

export const ADDRESSES = {
  PROD: {
    EXECUTOR_PLUGIN: ethers.utils.getAddress(
      "0xeC4181eE959e47f72e9cC60274fBE53D68949e47"
    ) as Address,
    MULTI_SEND: ethers.utils.getAddress(
      "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D"
    ) as Address
  },
  DEV: {
    EXECUTOR_PLUGIN: ethers.utils.getAddress(
      "0xb92929d03768a4F8D69552e15a8071EAf8E684ed"
    ) as Address,
    MULTI_SEND: ethers.utils.getAddress(
      "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D"
    ) as Address
  }
} as const;

export type AddressRegistry = Record<string, Address>;
export type AddressMetaRegistry = Record<string, AddressRegistry>;
