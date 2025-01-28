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
        metadata: any;
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

export type KernelExecutorConfig = {
  type: "INTERVAL";
  defaultEvery: string;
  executionTTL: string;
};

export type ConsoleExecutorPayload = {
  config: {
    inputTokens: Address[];
    hopAddresses: Address[];
    feeInBPS: number;
    feeToken: Address;
    feeReceiver: Address;
    limitPerExecution: boolean;
  };
  executor: string;
  signature: string;
  chainId: number;
  timestamp: number;
  executorMetadata: {
    id: string;
    name: string;
    logo: string;
    metadata: any;
  };
};

export type ConsoleExecutorConfig = {
  timestamp: number;
  executor: string;
  inputTokens: Address[];
  hopAddresses: Address[];
  feeReceiver: Address;
  limitPerExecution: boolean;
  clientId: string;
};

export type GenerateExecutableTypedDataParams = {
  chainId: number;
  pluginAddress: Address;
  operation: number;
  to: Address;
  account: Address;
  executor: Address;
  value: string;
  nonce: string;
  data: string;
};

export enum WorkflowExecutionStatus {
  UNSPECIFIED = 0,
  RUNNING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELED = 4,
  TERMINATED = 5,
  CONTINUED_AS_NEW = 6,
  TIMED_OUT = 7,
}

export type WorkflowStateResponse = {
  status: WorkflowExecutionStatus;
  out: {
    metadata: any;
    message: string;
    createdAt: string;
    subAccountAddress: Address;
    chainId: number;
    subId: string;
    outputTxHash: string;
  } | null;
};
