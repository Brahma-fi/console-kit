/********  Automation Context Types     **********/

import { Address } from "viem";

export type AutomationLogResponse = {
  id: string;
  subaccount_address: Address;
  chain_id: number;
  metadata: {
    req: {
      to: string;
      data: string;
      value: string;
      chainID: number;
      operation: number;
      subaccount: Address;
    };
    taskID: string;
    transitionState: {
      prev: {
        feesAmount: string;
        inputAmount: string;
        targetVault: Address;
        generatedYield: string;
      } | null;
      current: {
        feesAmount: "1000";
        inputAmount: "7999";
        targetVault: Address;
        generatedYield: "-1";
      };
    };
  };
  message: string;
  sub_id: string;
  createdAt: string;
  outputTxHash: string;
};

export type AutomationSubscription = {
  chainId: number;
  commitHash: string;
  createdAt: string;
  duration: number;
  feeAmount: string;
  feeToken: Address;
  id: string;
  metadata: {
    baseToken: string;
    every: string;
  };
  registryId: string;
  status: number; // 2 === active status
  subAccountAddress: Address;
  tokenInputs: Record<Address, string>;
  tokenLimits: Record<Address, string>;
};
