import axios, { AxiosError, AxiosInstance } from "axios";
import { Address, createPublicClient, Hex, http } from "viem";

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
  SolverParams,
  SwapParams,
  SwapQuoteRoute,
} from "./types";
import { safeAbi } from "@/constants";
import { CHAIN_CONFIG } from "@/wagmi";
import { SupportedChainIds } from "@/types";

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
   * @param {Address} eoa - The address of the EOA to fetch accounts for.
   * @param {Object} [filter] - Optional filters for narrowing down results.
   * @param {number} [filter.chainId] - Chain ID to filter accounts.
   * @param {number} [filter.threshold] - Required threshold value.
   * @param {number} [filter.ownersCount] - Required number of owners.
   * @returns {Promise<Account[]>} A promise that resolves to an array of filtered accounts.
   * @throws Returns an empty array if no accounts are found or an error occurs during the fetch.
   */
  async fetchExistingAccounts(
    eoa: Address,
    filter?: {
      chainId?: number;
      threshold?: number;
      ownersCount?: number;
    }
  ): Promise<Account[]> {
    try {
      if (!eoa) {
        throw new Error("EOA (Externally Owned Account) is required");
      }

      const response = await this.axiosInstance.get<{ data: Account[] }>(
        `${routes.fetchExistingAccounts}/${eoa}`
      );
      let allAccounts = response.data.data;

      if (!allAccounts || allAccounts.length === 0) {
        console.warn(`No accounts found for EOA: ${eoa}`);
        return [];
      }

      if (filter?.chainId !== undefined) {
        allAccounts = allAccounts.filter(
          (account) => account.chainId === filter.chainId
        );
      }

      if (
        filter?.threshold === undefined &&
        filter?.ownersCount === undefined
      ) {
        console.log("No additional filtering required, returning accounts.");
        return allAccounts;
      }

      const accountsByChain: Record<number, Account[]> = {};
      for (const account of allAccounts) {
        accountsByChain[account.chainId] =
          accountsByChain[account.chainId] || [];
        accountsByChain[account.chainId].push(account);
      }

      let filteredAccounts: Account[] = [];

      for (const [chainId, accounts] of Object.entries(accountsByChain)) {
        if (!CHAIN_CONFIG[Number(chainId) as SupportedChainIds]) {
          console.warn(`Unsupported chainId: ${chainId}, skipping...`);
          continue;
        }

        const publicClient = createPublicClient({
          chain: CHAIN_CONFIG[Number(chainId) as SupportedChainIds],
          transport: http(),
        });

        const results = await publicClient.multicall({
          contracts: accounts.flatMap((account) => [
            {
              address: account.consoleAddress as Address,
              abi: safeAbi,
              functionName: "getThreshold",
            },
            {
              address: account.consoleAddress as Address,
              abi: safeAbi,
              functionName: "getOwners",
            },
          ]),
        });

        accounts.forEach((account, index) => {
          const thresholdResult = results[index * 2];
          const ownersResult = results[index * 2 + 1];

          if (
            thresholdResult.status === "failure" ||
            ownersResult.status === "failure"
          ) {
            console.error(
              `Multicall failed for account: ${account.consoleAddress}, skipping...`
            );
            return;
          }

          const threshold = Number(thresholdResult.result ?? "0");
          const owners = ownersResult.result as Address[];

          const matchesThreshold =
            filter.threshold == null || threshold === filter.threshold;
          const matchesOwnersCount =
            filter.ownersCount == null || owners.length === filter.ownersCount;

          if (matchesThreshold && matchesOwnersCount) {
            filteredAccounts.push(account);
          }
        });
      }

      return filteredAccounts;
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

  /**
   * Initiates a bridge action to generate solver calldata for a transaction.
   *
   * @param {Address} accountAddress - The address of the account performing the transaction.
   * @param {SolverParams} params - The parameters for the solver action.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the calldata generation fails.
   */
  async solver(
    accountAddress: Address,
    params: SolverParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.solver,
            chainId: params.chainId,
            consoleAddress: accountAddress,
            params: {
              ...params,
              slippage: params.slippage * 1e2, // 4 basis points
            },
          },
        } as GeneratePayload<SolverParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }
}
