import { Address } from "viem";

export type Account = {
  consoleAddress: Address;
  eoa: Address;
  chainId: number;
  createdAt: string;
};

type ActionType = "SUBSCRIBE" | "UPDATE" | "CANCEL";

export type AutomationResponse = {
  data: {
    transactions: {
      to: Address;
      data: string;
      value: string;
      operation: number;
    }[];
    metadata: any | null;
  };
};

export type AutomationRequest<T> = {
  id: "AUTOMATION";
  action: ActionType;
  params: T;
};

export type SubscribeAutomationParams = {
  chainId: number;
  data: {
    metadata: Record<string, any>;
    duration: number;
    tokenInputs: Record<string, string>;
    tokenLimits: Record<string, string>;
    registryID: string;
    chainId: number;
    ownerAddress: string;
  };
};

export type UpdateAutomationParams = {
  subAccountAddress: Address;
  chainId: number;
  data: {
    sweepTokens: string[];
    execViaSubAcc: {
      to: Address;
      value: string;
      data: string;
    }[];
    metadata: Record<string, any>;
    duration: number;
    tokenInputs: Record<string, string>;
    tokenLimits: Record<string, string>;
    registryID: string;
    chainId: number;
    ownerAddress: Address;
  };
};

export type VendorCancelAutomationParams = {
  subAccountAddress: Address;
  chainId: number;
  data: {
    sweepTokens?: string[];
    execViaSubAcc: {
      to: Address;
      value: string;
      data: string;
    }[];
    ownerConsole: Address;
  };
};

export type Task = {
  id: string;
  payload: {
    executionCount: number;
    prevExecutionAt: string;
    prevExecutionID: string;
    runningExecutionWorkflowIDs: string[];
    nonce: number;
    params: {
      executorAddress: Address;
      subAccountAddress: Address;
      executorID: string;
      chainID: number;
      subscription: {
        chainId: number;
        commitHash: string;
        createdAt: string;
        duration: number;
        feeAmount: string;
        feeToken: Address;
        id: string;
        metadata: {
          every: string;
          rewardToken: Address;
          userAddress: Address;
        };
        registryId: string;
        status: number;
        subAccountAddress: Address;
        tokenInputs: Record<string, string>;
        tokenLimits: Record<string, string>;
      };
      isHostedWorkflow: boolean;
    };
    schedule: {
      every: number;
      ID: string;
    };
    triggeredAt: string;
  };
};

export type TaskResponse = {
  data: {
    tasks: Task[];
    cursor: number;
  };
};

export type SubmitTaskPayload = {
  task: {
    skip: boolean;
    skipReason: string;
    executorSignature: string;
    executor: string;
    subaccount: string;
    executable: {
      callType: number;
      to: string;
      value: string;
      data: string;
    };
  };
};

export type SubmitTaskRequest = {
  id: string;
  registryId: string;
  payload: SubmitTaskPayload;
};

export type SubmitTaskResponse = {
  success: boolean;
  message?: string;
};

export type ExecutorDetails = {
  registryId: string;
  metadata: {
    type: string;
    defaultEvery: string;
    executionTTL: string;
  };
  signature: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  relayerAddresses: Address[];
};
