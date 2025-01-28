import { Address } from "viem";

export type TAsset = {
  name: string;
  symbol?: string;
  icon?: React.ReactNode | string;
  address: Address;
  chainId: number;
  logo: string;
  decimals: number;
  balanceOf?: BalanceOf;
  value: string;
  prices: {
    default: number;
    [key: string]: number;
  };
  apy?: number;
  assetSubtitle?: string;
  actions: Action[];
  verified?: boolean;
  isImported?: boolean;
  core?: boolean;
};

type ActionCategory = "strategy" | "action" | "automation";

type Action = {
  id: number;
  name: string;
  logo: string;
  apy: number;
  chainId: number;
  category: ActionCategory;
  getTransactionCustomView?: (params?: any) => React.ReactNode;
  getTransactionExpandedCustomView?: (params?: any) => React.ReactNode;
  metadata?: {
    overview: string;
    supportedAssets?: string[];
    baseEntityId: number;
    canStack: boolean;
  };
};

type BalanceOf = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

export type UserClientFactory = {
  eoa: Address;
  accountAddress: Address;
  chainId: number;
  assets: TAsset[];
};

export interface Communicator {
  send<M extends Methods, P = unknown, R = unknown>(
    method: M,
    params: P
  ): Promise<SuccessResponse<R>>;
}

export type SDKRequestData<M extends Methods = Methods, P = unknown> = {
  id: RequestId;
  params: P;
  env: {
    sdkVersion: string;
  };
  method: M;
};

export type SDKMessageEvent = MessageEvent<SDKRequestData>;

export enum Methods {
  getClientFactory = "getClientFactory",
  addToTxnBuilder = "addToTxnBuilder",
  addAutomation = "addAutomation",
  cancelAutomation = "cancelAutomation",
}

export type RequestId = string;

export interface MethodToResponse {
  [Methods.getClientFactory]: UserClientFactory;
  [Methods.addToTxnBuilder]: void;
  [Methods.addAutomation]: void;
  [Methods.cancelAutomation]: void;
}

export type ErrorResponse = {
  id: RequestId;
  success: false;
  error: string;
  version?: string;
};

export type SuccessResponse<T = MethodToResponse[Methods]> = {
  id: RequestId;
  data: T;
  version?: string;
  success: true;
};

export type InterfaceMessageEvent = MessageEvent<Response>;

export type Response<T = MethodToResponse[Methods]> =
  | ErrorResponse
  | SuccessResponse<T>;

export type { Address };
export * from "./helpers/AutomationContext/types";
export * from "./helpers/BuilderCaller/types";
export * from "./helpers/PublicDeployer/types";
export * from "./helpers/CoreActions/types";
