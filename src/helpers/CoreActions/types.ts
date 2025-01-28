import { Address } from "viem";
import { TAsset } from "@/types";

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

export type SendParams = {
  to: Address;
  amount: string;
  tokenAddress: Address;
};

export type SwapParams = {
  amountIn: string;
  tokenIn: Address;
  tokenOut: Address;
  slippage: number;
  chainId: number;
  route: SwapQuoteRoute;
};

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

export type SwapQuoteRoute = {
  pid: number;
  dex: string;
  toAmount: string;
};

export type SwapQuoteRoutes = {
  data: SwapQuoteRoute[];
  error?: string;
};

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

export type BridgingChainStatus = "pending" | "success" | "failed" | "invalid";

export type GetBridgingStatus = {
  destinationStatus: BridgingChainStatus;
  destinationTransactionHash: Address;
  sourceStatus: BridgingChainStatus;
  sourceTransactionHash: Address;
};
