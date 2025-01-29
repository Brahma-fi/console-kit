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
  SwapQuoteRoute,
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

  /**
   * Fetches existing accounts associated with a given Externally Owned Account (EOA).
   *
   * @param {Address} eoa - The address of EOA to fetch Accounts for.
   * @returns {Promise<Account[]>} A promise that resolves to an array of Accounts.
   * @throws Will return an empty array if no accounts are found or if an error occurs during the fetch.
   */
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

  /**
   * Initiates a send action to generate calldata for transferring tokens on a blockchain network.
   *
   * @param {number} chainId - The ID of the blockchain network.
   * @param {Address} accountAddress - The address of the account sending the tokens.
   * @param {SendParams} params - The parameters for the send action, including recipient and token details.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the calldata generation fails.
   */
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

  /**
   * Initiates a swap action to generate calldata for swapping assets on a blockchain network.
   *
   * @param {number} chainId - The ID of the blockchain network.
   * @param {Address} accountAddress - The address of the account performing the swap.
   * @param {SwapParams} params - The parameters for the swap action.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the calldata generation fails.
   */
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

  /**
   * Fetches swap routes for a given asset pair and amount.
   *
   * @param {Address} fromAssetAddress - The address of the asset to swap from.
   * @param {Address} toAssetAddress - The address of the asset to swap to.
   * @param {Address} ownerAddress - The address of the owner initiating the swap.
   * @param {string} fromAmount - The amount of the asset to swap from.
   * @param {string} slippage - The acceptable slippage percentage for the swap.
   * @param {number} chainId - The ID of the blockchain network.
   * @returns {Promise<{ data: SwapQuoteRoute[]; error?: string }>} A promise that resolves to an object containing the swap routes data or an error message.
   * @throws Will return an error message if the request fails.
   */
  async getSwapRoutes(
    fromAssetAddress: Address,
    toAssetAddress: Address,
    ownerAddress: Address,
    fromAmount: string,
    slippage: string,
    chainId: number
  ): Promise<{ data: SwapQuoteRoute[]; error?: string }> {
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

      const response = await this.axiosInstance.get<SwapQuoteRoute[]>(
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

  /**
   * Initiates a bridge action to generate calldata for bridging assets between blockchain networks.
   *
   * @param {number} chainId - The ID of the blockchain network.
   * @param {Address} accountAddress - The address of the account performing the bridge.
   * @param {BridgeParams} params - The parameters for the bridge action.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the calldata generation fails.
   */
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

  /**
   * Fetches bridging routes based on the specified parameters.
   * @param {GetBridgingRoutesParams} params - The parameters for fetching bridging routes.
   * @returns {Promise<BridgeRoute[]>} A promise that resolves to an array of BridgeRoute objects.
   */
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

  /**
   * Fetches the status of a bridging transaction.
   * @param {Address} txnHash - The transaction hash.
   * @param {number} pid - The process ID.
   * @param {number} fromChainId - The ID of the source blockchain network.
   * @param {number} toChainId - The ID of the destination blockchain network.
   * @returns {Promise<GetBridgingStatus | null>} A promise that resolves to a GetBridgingStatus object or null.
   */
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

  /**
   * Indexes a transaction on the blockchain.
   * @param {string} transactionHash - The hash of the transaction to index.
   * @param {number} chainID - The ID of the blockchain network.
   * @returns {Promise<void>} A promise that resolves when the transaction is indexed.
   */
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
