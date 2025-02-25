import { Address } from "viem";

/**
 * Represents a log entry for an automation process.
 *
 * @property {string} id - The unique identifier of the log entry.
 * @property {Address} subaccount_address - The address of the sub-account associated with the log.
 * @property {number} chain_id - The ID of the blockchain network.
 * @property {Object} metadata - Additional metadata for the log entry.
 * @property {Object} metadata.req - The request details associated with the log.
 * @property {string} metadata.req.to - The address to which the request is sent.
 * @property {string} metadata.req.data - The data payload of the request.
 * @property {string} metadata.req.value - The value involved in the request.
 * @property {number} metadata.req.chainID - The ID of the blockchain network for the request.
 * @property {number} metadata.req.operation - The operation type of the request.
 * @property {Address} metadata.req.subaccount - The sub-account address involved in the request.
 * @property {string} metadata.taskID - The task ID associated with the log.
 * @property {Object} metadata.transitionState - The state transition details of the automation.
 * @property {any} metadata.transitionState.prev - The previous state details, if available.
 * @property {any} metadata.transitionState.current - The current state details.
 * @property {string} message - A message associated with the log entry.
 * @property {string} sub_id - The subscription ID associated with the log.
 * @property {string} createdAt - The timestamp when the log entry was created.
 * @property {string} outputTxHash - The transaction hash of the output, if available.
 */
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
      prev: any;
      current: any;
    };
  };
  message: string;
  sub_id: string;
  createdAt: string;
  outputTxHash: string;
};

/**
 * Represents an automation subscription associated with an account.
 *
 * @property {number} chainId - The ID of the blockchain network.
 * @property {string} commitHash - The commit hash associated with the subscription.
 * @property {string} createdAt - The timestamp when the subscription was created.
 * @property {number} duration - The duration of the subscription.
 * @property {string} feeAmount - The fee amount for the subscription.
 * @property {Address} feeToken - The address of the token used for the fee.
 * @property {string} id - The unique identifier of the subscription.
 * @property {Object} metadata - Additional metadata for the subscription.
 * @property {string} metadata.baseToken - The base token involved in the subscription.
 * @property {string} metadata.every - The frequency of the automation.
 * @property {string} registryId - The registry ID associated with the subscription.
 * @property {number} status - The status of the subscription (e.g., 2 for active).
 * @property {Address} subAccountAddress - The address of the sub-account associated with the subscription.
 * @property {Record<Address, string>} tokenInputs - The input tokens required for the automation, mapped by token addresses.
 * @property {Record<Address, string>} tokenLimits - The limits for each token involved in the automation, mapped by token addresses.
 */
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

/**
 * Represents the parameters required to subscribe to an automation service.
 *
 * @property {number} chainId - The ID of the blockchain network.
 * @property {Object} data - The detailed data required for the subscription.
 * @property {Record<string, any>} data.metadata - Additional metadata for the subscription.
 * @property {number} data.duration - The duration for which the subscription is valid.
 * @property {Record<string, string>} data.tokenInputs - The input tokens required for the automation, mapped by token identifiers.
 * @property {Record<string, string>} data.tokenLimits - The limits for each token involved in the automation, mapped by token identifiers.
 * @property {string} data.registryID - The registry ID associated with the automation.
 * @property {number} data.chainId - The ID of the blockchain network for the data.
 * @property {string} data.ownerAddress - The address of the owner subscribing to the automation.
 */
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
    whitelistedAddress: string;
  };
};

/**
 * Represents the parameters required to update an automation service.
 *
 * @property {Address} subAccountAddress - The address of the sub-account associated with the automation.
 * @property {number} chainId - The ID of the blockchain network.
 * @property {Object} data - The detailed data required for the update.
 * @property {string[]} data.sweepTokens - An array of tokens to be swept during the update.
 * @property {Array<{ to: Address; value: string; data: string }>} data.execViaSubAcc - Execution details via sub-account.
 * @property {Record<string, any>} data.metadata - Additional metadata for the update.
 * @property {number} data.duration - The duration for which the update is valid.
 * @property {Record<string, string>} data.tokenInputs - The input tokens required for the automation, mapped by token identifiers.
 * @property {Record<string, string>} data.tokenLimits - The limits for each token involved in the automation, mapped by token identifiers.
 * @property {string} data.registryID - The registry ID associated with the automation.
 * @property {number} data.chainId - The ID of the blockchain network for the data.
 * @property {Address} data.ownerAddress - The address of the owner updating the automation.
 */
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

/**
 * Represents the parameters required to cancel an automation service.
 *
 * @property {Address} subAccountAddress - The address of the sub-account associated with the automation.
 * @property {number} chainId - The ID of the blockchain network.
 * @property {Object} data - The detailed data required for the cancellation.
 * @property {string[]} [data.sweepTokens] - An optional array of tokens to be swept during the cancellation.
 * @property {Array<{ to: Address; value: string; data: string }>} data.execViaSubAcc - Execution details via sub-account.
 * @property {Address} data.ownerConsole - The console address of the owner canceling the automation.
 */
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
    sweepTokenReceiver: Address;
  };
};

/**
 * Represents a task associated with a registry.
 *
 * @property {string} id - The unique identifier of the task.
 * @property {Object} payload - The payload details of the task.
 * @property {number} payload.executionCount - The number of times the task has been executed.
 * @property {string} payload.prevExecutionAt - The timestamp of the previous execution.
 * @property {string} payload.prevExecutionID - The ID of the previous execution.
 * @property {string[]} payload.runningExecutionWorkflowIDs - The IDs of currently running execution workflows.
 * @property {number} payload.nonce - The nonce associated with the task.
 * @property {Object} payload.params - The parameters for the task execution.
 * @property {Address} payload.params.executorAddress - The address of the executor.
 * @property {Address} payload.params.subAccountAddress - The address of the sub-account.
 * @property {string} payload.params.executorID - The ID of the executor.
 * @property {number} payload.params.chainID - The ID of the blockchain network.
 * @property {Object} payload.params.subscription - The subscription details associated with the task.
 * @property {number} payload.params.subscription.chainId - The ID of the blockchain network for the subscription.
 * @property {string} payload.params.subscription.commitHash - The commit hash associated with the subscription.
 * @property {string} payload.params.subscription.createdAt - The timestamp when the subscription was created.
 * @property {number} payload.params.subscription.duration - The duration of the subscription.
 * @property {string} payload.params.subscription.feeAmount - The fee amount for the subscription.
 * @property {Address} payload.params.subscription.feeToken - The address of the token used for the fee.
 * @property {string} payload.params.subscription.id - The unique identifier of the subscription.
 * @property {any} payload.params.subscription.metadata - Additional metadata for the subscription.
 * @property {string} payload.params.subscription.registryId - The registry ID associated with the subscription.
 * @property {number} payload.params.subscription.status - The status of the subscription.
 * @property {Address} payload.params.subscription.subAccountAddress - The address of the sub-account associated with the subscription.
 * @property {Record<string, string>} payload.params.subscription.tokenInputs - The input tokens required for the subscription, mapped by token identifiers.
 * @property {Record<string, string>} payload.params.subscription.tokenLimits - The limits for each token involved in the subscription, mapped by token identifiers.
 * @property {boolean} payload.params.isHostedWorkflow - Indicates if the task is part of a hosted workflow.
 * @property {Object} payload.schedule - The schedule details for the task.
 * @property {number} payload.schedule.every - The interval at which the task is scheduled to run.
 * @property {string} payload.schedule.ID - The ID of the schedule.
 * @property {string} payload.triggeredAt - The timestamp when the task was last triggered.
 */
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

/**
 * Represents the response structure for fetching tasks.
 *
 * @property {Object} data - The data containing tasks and pagination information.
 * @property {Task[]} data.tasks - An array of Task objects retrieved from the response.
 * @property {number} data.cursor - The cursor for pagination, indicating the position for the next set of tasks.
 */
export type TaskResponse = {
  data: {
    tasks: Task[];
    cursor: number;
  };
};

/**
 * Represents the request object for submitting a task.
 *
 * @property {string} id - The unique identifier of the task.
 * @property {string} registryId - The registry ID associated with the task.
 * @property {Object} payload - The payload containing the task details.
 * @property {Object} payload.task - The task details to be submitted.
 * @property {boolean} payload.task.skip - Indicates whether the task should be skipped.
 * @property {string} payload.task.skipReason - The reason for skipping the task, if applicable.
 * @property {string} payload.task.executorSignature - The signature of the executor.
 * @property {string} payload.task.executor - The address of the executor.
 * @property {string} payload.task.subaccount - The address of the sub-account associated with the task.
 * @property {Object} payload.task.executable - The executable details of the task.
 * @property {number} payload.task.executable.callType - The type of call to be executed.
 * @property {string} payload.task.executable.to - The address to which the call is made.
 * @property {string} payload.task.executable.value - The value to be transferred in the call.
 * @property {string} payload.task.executable.data - The data payload of the call.
 */
export type SubmitTaskRequest = {
  id: string;
  registryId: string;
  payload: {
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
};

/**
 * Represents the response from submitting a task.
 *
 * @property {boolean} success - Indicates whether the task submission was successful.
 * @property {string} [message] - An optional message providing additional information about the submission result.
 */
export type SubmitTaskResponse = {
  success: boolean;
  message?: string;
};

/**
 * Represents the details of an executor.
 *
 * @property {string} registryId - The unique identifier of the registry associated with the executor.
 * @property {Object} metadata - Additional metadata related to the executor.
 * @property {string} metadata.type - The type of the executor.
 * @property {string} metadata.defaultEvery - The default interval for execution.
 * @property {string} metadata.executionTTL - The time-to-live for the execution.
 * @property {string} signature - The signature associated with the executor.
 * @property {boolean} enabled - Indicates whether the executor is enabled.
 * @property {string} created_at - The timestamp when the executor was created.
 * @property {string} updated_at - The timestamp when the executor was last updated.
 * @property {Address[]} relayerAddresses - An array of addresses for the relayers associated with the executor.
 */
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

/**
 * Represents the configuration details for a kernel executor.
 *
 * @property {"INTERVAL"} type - The type of the executor, typically "INTERVAL".
 * @property {string} defaultEvery - The default interval for execution.
 * @property {string} executionTTL - The time-to-live for the execution.
 */
export type KernelExecutorConfig = {
  type: "INTERVAL";
  defaultEvery: string;
  executionTTL: string;
};

/**
 * Represents the EIP-712 structured data for registering a kernel executor.
 *
 * @property {Object} types - The types used in the EIP-712 message.
 * @property {Array<{ name: string; type: string }>} types.ModifyExecutor - The fields and types for the ModifyExecutor message.
 * @property {Object} domain - The domain details for the EIP-712 message.
 * @property {number} domain.chainId - The ID of the blockchain network.
 * @property {Object} message - The message details for the EIP-712 message.
 * @property {string} message.registryId - The registry ID for the executor.
 * @property {string} message.type - The type of the executor.
 * @property {string} message.ttl - The time-to-live for the executor.
 * @property {boolean} message.enable - Indicates whether the executor is enabled.
 */
export type KernelExecutorRegistration712Message = {
  types: {
    ModifyExecutor: { name: string; type: string }[];
  };
  domain: {
    chainId: number;
  };
  message: {
    registryId: string;
    type: string;
    ttl: string;
    enable: boolean;
  };
};

/**
 * Represents the payload for registering a console executor.
 *
 * @property {Object} config - The configuration details for the executor.
 * @property {Address[]} config.inputTokens - An array of input token addresses.
 * @property {Address[]} config.hopAddresses - An array of hop addresses.
 * @property {number} config.feeInBPS - The fee in basis points.
 * @property {Address} config.feeToken - The address of the fee token.
 * @property {Address} config.feeReceiver - The address that will receive the fees.
 * @property {boolean} config.limitPerExecution - A flag indicating if there is a limit per execution.
 * @property {string} executor - The address of the executor.
 * @property {string} signature - The signature required for registration.
 * @property {number} chainId - The ID of the blockchain network.
 * @property {number} timestamp - The timestamp for the registration.
 * @property {Object} executorMetadata - Metadata associated with the executor.
 * @property {string} executorMetadata.id - The client identifier.
 * @property {string} executorMetadata.name - The name of the executor.
 * @property {string} executorMetadata.logo - The logo URL or identifier for the executor.
 * @property {any} executorMetadata.metadata - Additional metadata associated with the executor.
 */
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

/**
 * Represents the configuration details for a console executor.
 *
 * @property {number} timestamp - The timestamp for the registration.
 * @property {string} executor - The address of the executor.
 * @property {Address[]} inputTokens - An array of input token addresses.
 * @property {Address[]} hopAddresses - An array of hop addresses.
 * @property {Address} feeReceiver - The address that will receive the fees.
 * @property {boolean} limitPerExecution - A flag indicating if there is a limit per execution.
 * @property {string} clientId - The client identifier.
 */
export type ConsoleExecutorConfig = {
  timestamp: number;
  executor: string;
  inputTokens: Address[];
  hopAddresses: Address[];
  feeReceiver: Address;
  limitPerExecution: boolean;
  clientId: string;
};

/**
 * Represents the EIP-712 structured data for registering a console executor.
 *
 * @property {Object} types - The types used in the EIP-712 message.
 * @property {Array<{ name: string; type: string }>} types.RegisterExecutor - The fields and types for the RegisterExecutor message.
 * @property {Object} domain - The domain details for the EIP-712 message.
 * @property {number} domain.chainId - The ID of the blockchain network.
 * @property {Object} message - The message details for the EIP-712 message.
 * @property {number} message.feeInBPS - The fee in basis points.
 * @property {string} message.feeToken - The address of the fee token.
 * @property {string} primaryType - The primary type of the EIP-712 message, typically "RegisterExecutor".
 */
export type ConsoleExecutorRegistration712Message = {
  types: {
    RegisterExecutor: { name: string; type: string }[];
  };
  domain: {
    chainId: number;
  };
  message: ConsoleExecutorConfig & {
    feeInBPS: number;
    feeToken: Address;
  };
  primaryType: string;
};

/**
 * Represents the EIP-712 structured data for generating an executable digest.
 *
 * @property {Object} types - The types used in the EIP-712 message.
 * @property {Array<{ name: string; type: string }>} types.ExecutionParams - The fields and types for the ExecutionParams message.
 * @property {string} primaryType - The primary type of the EIP-712 message, typically "ExecutionParams".
 * @property {Object} domain - The domain details for the EIP-712 message.
 * @property {string} domain.name - The name of the domain.
 * @property {string} domain.version - The version of the domain.
 * @property {number} domain.chainId - The ID of the blockchain network.
 * @property {Address} domain.verifyingContract - The address of the contract verifying the message.
 * @property {Object} message - The message details for the EIP-712 message.
 * @property {number} message.operation - The operation type.
 * @property {Address} message.to - The recipient address.
 * @property {Address} message.account - The account address.
 * @property {Address} message.executor - The executor address.
 * @property {string} message.value - The value involved in the transaction.
 * @property {string} message.nonce - The nonce for the transaction.
 * @property {bytes} message.data - The data payload of the transaction.
 * @property {Address} message.gasToken - The token used for gas payment.
 * @property {Address} message.refundReceiver - The address receiving any gas refund.
 * @property {string} message.safeTxGas - The safe transaction gas limit.
 * @property {string} message.baseGas - The base gas for the transaction.
 * @property {string} message.gasPrice - The gas price for the transaction.
 */
export type ExecutableDigest712Message = {
  types: {
    ExecutionParams: { name: string; type: string }[];
  };
  primaryType: string;
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  };
  message: {
    operation: number;
    to: Address;
    account: Address;
    executor: Address;
    value: string;
    nonce: string;
    data: string;
    gasToken: Address;
    refundReceiver: Address;
    safeTxGas: string;
    baseGas: string;
    gasPrice: string;
  };
};

/**
 * Represents the parameters required to generate an executable digest using EIP-712.
 *
 * @property {number} chainId - The ID of the blockchain network.
 * @property {Address} pluginAddress - The address of the plugin contract verifying the message.
 * @property {uint8} operation - The operation type for the execution.
 * @property {Address} to - The recipient address of the transaction.
 * @property {Address} account - The account address involved in the transaction.
 * @property {Address} executor - The executor address responsible for the transaction.
 * @property {uint256} value - The value involved in the transaction.
 * @property {uint256} nonce - The nonce for the transaction.
 * @property {bytes} data - The data payload of the transaction.
 */
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

/**
 * Enum representing the possible execution statuses of a workflow.
 *
 * @enum {number}
 * @property {number} UNSPECIFIED - The status is unspecified.
 * @property {number} RUNNING - The workflow is currently running.
 * @property {number} COMPLETED - The workflow has completed successfully.
 * @property {number} FAILED - The workflow has failed.
 * @property {number} CANCELED - The workflow has been canceled.
 * @property {number} TERMINATED - The workflow has been terminated.
 * @property {number} CONTINUED_AS_NEW - The workflow has continued as a new instance.
 * @property {number} TIMED_OUT - The workflow has timed out.
 */
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

/**
 * Represents the state response of a workflow execution.
 *
 * @property {WorkflowExecutionStatus} status - The current execution status of the workflow.
 * @property {Object|null} out - The output details of the workflow execution, or null if not available.
 * @property {any} out.metadata - Additional metadata related to the workflow execution.
 * @property {string} out.message - A message associated with the workflow execution.
 * @property {string} out.createdAt - The timestamp when the workflow execution was created.
 * @property {Address} out.subAccountAddress - The address of the sub-account associated with the workflow.
 * @property {number} out.chainId - The ID of the blockchain network.
 * @property {string} out.subId - The subscription ID associated with the workflow.
 * @property {string} out.outputTxHash - The transaction hash of the output, if available.
 */
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
