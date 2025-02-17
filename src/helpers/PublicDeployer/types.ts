/********* Public Deployer Types *************/

import { Address } from "viem";

/**
 * Represents the subscription limits for an automation service.
 *
 * @property {number} duration - The duration of the subscription in seconds.
 * @property {Record<Address, string>} tokenInputs - The input tokens required for the automation, mapped by token addresses.
 * @property {Record<Address, string>} tokenLimits - The limits for each token involved in the automation, mapped by token addresses.
 */
export type AutomationSubscriptionLimits = {
  duration: number;
  tokenInputs: Record<Address, string>;
  tokenLimits: Record<Address, string>;
  whitelistedAddresses?: Address[];
};

/**
 * Represents the precomputed address data for a specific owner, chain ID, and fee token.
 *
 * @property {Address} precomputedAddress - The precomputed address for the given parameters.
 * @property {string} feeEstimate - The estimated fee for deploying the address.
 * @property {string} feeEstimateSignature - The signature validating the fee estimate.
 */
export type PreComputedAddressData = {
  precomputedAddress: Address;
  feeEstimate: string;
  feeEstimateSignature: string;
};

/**
 * Represents the response containing the transfer calldata and related information.
 *
 * @property {Object} signaturePayload - The payload containing the signature details.
 * @property {Object} signaturePayload.domain - The domain details for the signature.
 * @property {Address} signaturePayload.domain.verifyingContract - The address of the contract verifying the signature.
 * @property {string} signaturePayload.domain.chainId - The ID of the blockchain network.
 * @property {string} signaturePayload.domain.name - The name of the domain.
 * @property {string} signaturePayload.domain.salt - The salt used in the domain.
 * @property {string} signaturePayload.domain.version - The version of the domain.
 * @property {Object} signaturePayload.message - The message details for the transaction.
 * @property {Address} signaturePayload.message.to - The recipient address of the transaction.
 * @property {number} signaturePayload.message.baseGas - The base gas for the transaction.
 * @property {string} signaturePayload.message.data - The data payload of the transaction.
 * @property {number} signaturePayload.message.gasPrice - The gas price for the transaction.
 * @property {Address} signaturePayload.message.gasToken - The token used for gas payment.
 * @property {number} signaturePayload.message.nonce - The nonce for the transaction.
 * @property {number} signaturePayload.message.operation - The operation type of the transaction.
 * @property {Address} signaturePayload.message.refundReceiver - The address receiving any gas refund.
 * @property {number} signaturePayload.message.safeTxGas - The safe transaction gas limit.
 * @property {number} signaturePayload.message.value - The value transferred in the transaction.
 * @property {string} signaturePayload.primaryType - The primary type of the signature, typically "SafeTx".
 * @property {Object} signaturePayload.types - The types used in the signature.
 * @property {Array<{ name: string; type: string }>} signaturePayload.types.SafeTx - The fields and types for the SafeTx signature.
 * @property {string} subAccountPolicyCommit - The commit hash of the sub-account policy.
 * @property {string} subscriptionDraftID - The draft ID of the subscription.
 */
export type TransferCalldataResponse = {
  signaturePayload: {
    domain: {
      verifyingContract: Address;
      chainId: string;
      name: string;
      salt: string;
      version: string;
    };
    message: {
      to: Address;
      baseGas: number;
      data: string;
      gasPrice: number;
      gasToken: Address;
      nonce: number;
      operation: number;
      refundReceiver: Address;
      safeTxGas: number;
      value: number;
    };
    primaryType: "SafeTx";
    types: {
      SafeTx: {
        name: string;
        type: string;
      }[];
    };
  };
  subAccountPolicyCommit: string;
  subscriptionDraftID: string;
};

/**
 * Represents the response containing precomputed deployment addresses for account and sub-account setup.
 *
 * @property {string} subAccountAddress - The precomputed address for the sub-account.
 * @property {string} consoleAddress - The precomputed address for the console account.
 */
export type PrecomputeResponse = {
  subAccountAddress: string;
  consoleAddress: string;
};

/**
 * Represents the possible statuses of a task.
 *
 * @enum {string}
 * @property {"pending"} pending - The task is pending and has not started yet.
 * @property {"executing"} executing - The task is currently being executed.
 * @property {"cancelled"} cancelled - The task has been cancelled.
 * @property {"successful"} successful - The task has completed successfully.
 * @property {"failed"} failed - The task has failed.
 */
export type TaskIdStatusType =
  | "pending"
  | "executing"
  | "cancelled"
  | "successful"
  | "failed";

/**
 * Represents the status data of a task.
 *
 * @property {string} taskId - The unique identifier of the task.
 * @property {Object} metadata - Additional metadata related to the task.
 * @property {unknown} metadata.request - The request data associated with the task.
 * @property {Object} metadata.response - The response data associated with the task.
 * @property {boolean} metadata.response.isSuccessful - Indicates if the task was successful.
 * @property {string | null} metadata.response.error - The error message if the task failed, or null if successful.
 * @property {string | null} metadata.response.transactionHash - The transaction hash if available, or null.
 * @property {string | null} outputTransactionHash - The hash of the output transaction, or null if not available.
 * @property {TaskIdStatusType} status - The current status of the task.
 * @property {string} createdAt - The timestamp when the task was created.
 */
export type TaskStatusData = {
  taskId: string;
  metadata: {
    request: unknown;
    response: {
      isSuccessful: boolean;
      error: string | null;
      transactionHash: string | null;
    };
  };
  outputTransactionHash: string | null;
  status: TaskIdStatusType;
  createdAt: string;
};
