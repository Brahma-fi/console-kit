import { Address } from "viem";

/**
 * Represents an account associated with an Externally Owned Account (EOA).
 *
 * @property {Address} consoleAddress - The console address of the account.
 * @property {Address} eoa - The Externally Owned Address of the account.
 * @property {number} chainId - The ID of the blockchain network where the account exists.
 * @property {string} createdAt - The timestamp when the account was created.
 */
export type Account = {
  consoleAddress: Address;
  eoa: Address;
  chainId: number;
  createdAt: string;
};

type ActionType = "SUBSCRIBE" | "UPDATE" | "CANCEL" | "BUILD";

export enum ActionNameToId {
  send = 301,
  swap = 309,
  bridging = 326,
}

export type GeneratePayload<T, A extends ActionType> = A extends "BUILD"
  ? {
      id: string;
      action: "BUILD";
      params: {
        id: ActionNameToId;
        chainId: number;
        consoleAddress: Address;
        params: T;
      };
    }
  : {
      id: "AUTOMATION";
      action: A;
      params: T;
    };

/**
 * Represents the response from the `generateCalldata` route, containing a list of transactions and associated metadata.
 *
 * @interface GenerateCalldataResponse
 * @member {Object[]} data.transactions - An array of transaction objects.
 * @member {Address} data.transactions[].to - The address to which the transaction is sent.
 * @member {string} data.transactions[].data - The calldata for the transaction.
 * @member {string} data.transactions[].value - The value of the transaction in wei.
 * @member {number} data.transactions[].operation - The operation type of the transaction.
 * @member {any | null} data.metadata - Additional metadata associated with the transactions, or null if not applicable.
 */
export type GenerateCalldataResponse = {
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

/**
 * Represents the parameters required for a send action.
 *
 * @property {Address} to - The address of the recipient.
 * @property {string} amount - The amount of tokens to send.
 * @property {Address} tokenAddress - The address of the token to be sent.
 */
export type SendParams = {
  to: Address;
  amount: string;
  tokenAddress: Address;
};

/**
 * Represents the parameters required for a swap action.
 *
 * @property {string} amountIn - The amount of the input token to swap.
 * @property {Address} tokenIn - The address of the input token.
 * @property {Address} tokenOut - The address of the output token.
 * @property {number} slippage - The acceptable slippage percentage for the swap.
 * @property {number} chainId - The ID of the blockchain network.
 * @property {SwapQuoteRoute} route - The swap route obtained from the `getSwapRoutes` method.
 */
export type SwapParams = {
  amountIn: string;
  tokenIn: Address;
  tokenOut: Address;
  slippage: number;
  chainId: number;
  route: SwapQuoteRoute;
};

/**
 * Represents a single swap quote route.
 *
 * @property {number} pid - The process ID associated with the swap route.
 * @property {string} dex - The decentralized exchange (DEX) used for the swap.
 * @property {string} toAmount - The amount of the asset to be received from the swap.
 */
export type SwapQuoteRoute = {
  pid: number;
  dex: string;
  toAmount: string;
};

/**
 * Represents a route for bridging assets between blockchain networks.
 *
 * @interface BridgeRoute
 * @member {number} pid - The process ID associated with the route.
 * @member {number} priority - The priority level of the route.
 * @member {TxBuildObject} txBuildObject - The transaction build object containing details of the transaction.
 * @member {string} toAmount - The amount of the asset to be received on the destination chain.
 * @member {number} duration - The estimated duration for the bridging process.
 * @member {number} maxDuration - The maximum possible duration for the bridging process.
 * @member {PathItem[]} pathItems - The list of path items detailing each step in the bridging process.
 * @member {string | null} bridge - The name of the bridge used, or null if not applicable.
 */
export type BridgeRoute = {
  pid: number;
  priority: number;
  txBuildObject: TxBuildObject;
  toAmount: string;
  duration: number;
  maxDuration: number;
  pathItems: PathItem[];
  bridge: string | null;
};

/**
 * Parameters required for executing a bridge action between blockchain networks.
 *
 * @interface BridgeParams
 * @member {number} chainIdIn - The ID of the source blockchain network.
 * @member {number} chainIdOut - The ID of the destination blockchain network.
 * @member {Address} tokenIn - The address of the token on the source chain.
 * @member {Address} tokenOut - The address of the token on the destination chain.
 * @member {string} amountIn - The amount of the token to be sent from the source chain.
 * @member {string} amountOut - The expected amount of the token to be received on the destination chain.
 * @member {number} slippage - The acceptable slippage percentage for the transaction.
 * @member {Address} recipient - The address of the recipient on the destination chain.
 * @member {Address} ownerAddress - The address of the token owner initiating the bridge.
 * @member {BridgeRoute} route - The route details for the bridging process, received from the `fetchBridgingRoutes` method.
 */
export type BridgeParams = {
  chainIdIn: number;
  chainIdOut: number;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: string;
  amountOut: string;
  slippage: number;
  recipient: Address;
  ownerAddress: Address;
  route: BridgeRoute;
};

/**
 * Parameters required for fetching bridging routes.
 *
 * @interface GetBridgingRoutesParams
 * @member {number} chainIdIn - The ID of the input blockchain network.
 * @member {number} chainIdOut - The ID of the output blockchain network.
 * @member {string} tokenIn - The address of the input token.
 * @member {string} tokenOut - The address of the output token.
 * @member {string} amountIn - The amount of the input token.
 * @member {string} amountOut - The amount of the output token.
 * @member {number} slippage - The acceptable slippage percentage.
 * @member {string} ownerAddress - The address of the token owner.
 * @member {Address} recipient - The address of the recipient.
 */
export type GetBridgingRoutesParams = {
  chainIdIn: number;
  chainIdOut: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  slippage: number;
  ownerAddress: string;
  recipient: Address;
};

type Protocol = {
  icon: string;
  name: string;
};

/**
 * Represents an item in the path of a bridging or swapping process.
 *
 * @interface PathItem
 * @member {string} fromAmount - The amount of the asset being sent from the source chain.
 * @member {number} fromChainId - The ID of the source blockchain network.
 * @member {string} fromTokenAddress - The address of the token on the source chain.
 * @member {"bridge" | "swap"} pathAction - The action to be performed, either bridging or swapping.
 * @member {Protocol} protocol - The protocol used for the action.
 * @member {string} toAmount - The amount of the asset to be received on the destination chain.
 * @member {number} toChainId - The ID of the destination blockchain network.
 * @member {string} toTokenAddress - The address of the token on the destination chain.
 */
export type PathItem = {
  fromAmount: string;
  fromChainId: number;
  fromTokenAddress: string;
  pathAction: "bridge" | "swap";
  protocol: Protocol;
  toAmount: string;
  toChainId: number;
  toTokenAddress: string;
};

/**
 * Represents the transaction build object containing details of a transaction.
 *
 * @interface TxBuildObject
 * @member {string} fromAmount - The amount of the asset being sent.
 * @member {number} inputValueInUsd - The input value of the transaction in USD.
 * @member {number} outputValueInUsd - The output value of the transaction in USD.
 * @member {number} receivedValueInUsd - The value received from the transaction in USD.
 * @member {string} recipient - The address of the recipient.
 * @member {string} routeId - The ID of the route used for the transaction.
 * @member {string} sender - The address of the sender.
 * @member {number} serviceTime - The service time for the transaction.
 * @member {string} toAmount - The amount of the asset to be received.
 * @member {number} totalGasFeesInUsd - The total gas fees for the transaction in USD.
 */
export type TxBuildObject = {
  fromAmount: string;
  inputValueInUsd: number;
  outputValueInUsd: number;
  receivedValueInUsd: number;
  recipient: string;
  routeId: string;
  sender: string;
  serviceTime: number;
  toAmount: string;
  totalGasFeesInUsd: number;
};

/**
 * Represents the possible statuses of a bridging transaction on a blockchain.
 *
 * - "pending": The transaction is still being processed.
 * - "success": The transaction was completed successfully.
 * - "failed": The transaction failed to complete.
 * - "invalid": The transaction is invalid or not recognized.
 */
export type BridgingChainStatus = "pending" | "success" | "failed" | "invalid";

/**
 * Represents the status of a bridging transaction.
 *
 * @interface GetBridgingStatus
 * @member {BridgingChainStatus} destinationStatus - The status of the transaction on the destination chain.
 * @member {Address} destinationTransactionHash - The transaction hash on the destination chain.
 * @member {BridgingChainStatus} sourceStatus - The status of the transaction on the source chain.
 * @member {Address} sourceTransactionHash - The transaction hash on the source chain.
 */
export type GetBridgingStatus = {
  destinationStatus: BridgingChainStatus;
  destinationTransactionHash: Address;
  sourceStatus: BridgingChainStatus;
  sourceTransactionHash: Address;
};
