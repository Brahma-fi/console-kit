import axios, { AxiosError, AxiosInstance } from "axios";
import { Address } from "viem";

import routes from "@/routes";

import {
  Account,
  ActionNameToId,
  BridgeParams,
  BridgeRoute,
  GenerateCalldataResponse,
  GeneratePayload,
  GetBridgingRoutesParams,
  GetBridgingStatus,
  SendParams,
  SwapParams,
  SwapQuoteRoutes,
} from "./types";

export class CoreActions {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "x-api-key": apiKey,
      },
    });
  }

  // Get Existing Accounts of users
  async fetchExistingAccounts(eoa: Address): Promise<Account[]> {
    try {
      if (!eoa) {
        throw new Error("EOA (Externally Owned Account) is required");
      }

      const response = await this.axiosInstance.get<{ data: Account[] }>(
        `${routes.fetchExistingAccounts}/${eoa}`
      );

      if (!response.data.data) {
        throw new Error("No accounts found for the given EOA");
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching existing accounts: ${err.message}`);
      return [];
    }
  }

  // Send action
  async send(
    chainId: number,
    accountAddress: Address,
    params: SendParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.send,
            chainId: chainId,
            consoleAddress: accountAddress,
            params,
          },
        } as GeneratePayload<SendParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }

  // Swap action
  async swap(
    chainId: number,
    accountAddress: Address,
    params: SwapParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.swap,
            chainId: chainId,
            consoleAddress: accountAddress,
            params,
          },
        } as GeneratePayload<SwapParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }

  async getSwapRoutes(
    fromAssetAddress: Address,
    toAssetAddress: Address,
    ownerAddress: Address,
    fromAmount: string,
    slippage: string,
    chainId: number
  ): Promise<SwapQuoteRoutes> {
    const requestData = {
      chainId,
      fromAssetAddress,
      toAssetAddress,
      ownerAddress,
      fromAmount,
      slippage,
    };

    try {
      const params = new URLSearchParams();
      Object.entries(requestData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value.toString());
        }
      });
      const queryString = params.toString();

      const response = await this.axiosInstance.get<SwapQuoteRoutes["data"]>(
        `${routes.swapRoutes}?${queryString}`
      );

      return { data: response.data, error: undefined };
    } catch (err: any) {
      const error = err as AxiosError<{ message: string }>;

      return {
        data: [],
        error: error.response?.data?.message ?? error.message,
      };
    }
  }

  // Bridge action
  async bridge(
    chainId: number,
    accountAddress: Address,
    params: BridgeParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.bridging,
            chainId: chainId,
            consoleAddress: accountAddress,
            params,
          },
        } as GeneratePayload<BridgeParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }

  async fetchBridgingRoutes(
    params: GetBridgingRoutesParams
  ): Promise<BridgeRoute[]> {
    try {
      const query = new URLSearchParams({
        chainIdIn: params.chainIdIn.toString(),
        chainIdOut: params.chainIdOut.toString(),
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amountIn.toString(),
        amountOut: params.amountOut.toString(),
        slippage: params.slippage.toString(),
        ownerAddress: params.ownerAddress,
        recipient: params.recipient,
      }).toString();

      const url = `${routes.fetchBridgingRoutes}?${query}`;
      const response = await this.axiosInstance.get<BridgeRoute[]>(url);
      return response.data || [];
    } catch (err: any) {
      console.error(`Error fetching bridging routes: ${err.message}`);
      return [];
    }
  }

  async fetchBridgingStatus(
    txnHash: Address,
    pid: number,
    fromChainId: number,
    toChainId: number
  ): Promise<GetBridgingStatus | null> {
    try {
      const queryParams = new URLSearchParams({
        pid: pid.toString(),
        transactionHash: txnHash,
        fromChainId: fromChainId.toString(),
        toChainId: toChainId.toString(),
      });

      const response = await this.axiosInstance.get<GetBridgingStatus>(
        `${routes.fetchBridgingStatus}?${queryParams.toString()}`
      );
      return response.data;
    } catch (err: any) {
      return null;
    }
  }

  // Indexing txn
  async indexTransaction(
    transactionHash: string,
    chainID: number
  ): Promise<void> {
    try {
      const response = await this.axiosInstance.post(
        `${routes.indexTransaction}/${transactionHash}/${chainID}`
      );

      if (response.status !== 204) {
        throw new Error("Failed to index transaction");
      }

      console.log("Transaction indexed successfully");
    } catch (err: any) {
      console.error(`Error indexing transaction: ${err.message}`);
      throw err;
    }
  }
}
