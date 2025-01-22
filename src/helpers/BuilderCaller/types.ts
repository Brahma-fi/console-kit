/********  Builder Caller Types **************/

import { Address } from "viem";

export type Transaction = {
  toAddress: string;
  callData: string;
  value: bigint;
};

export type BuilderParams = {
  transactions: Transaction[];
};

export type AddToTxnBuilderParams = {
  params: BuilderParams;
  automationName: string;
};

export type AddAutomationParams = {
  tokenLimits: Record<`0x${string}`, string>;
  tokenInputs: Record<`0x${string}`, string>;
  registryId: string;
  feeToken: Address;
  feeAmount: string;
  metadata: Record<string, any>;
};

export type CancelAutomationParams = {
  subaccount: Address;
};
