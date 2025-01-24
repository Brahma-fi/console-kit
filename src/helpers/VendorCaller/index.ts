import axios, { AxiosInstance } from "axios";
import { Address, TypedData } from "viem";
import {
  Account,
  AutomationRequest,
  AutomationResponse,
  VendorCancelAutomationParams,
  SubmitTaskRequest,
  SubmitTaskResponse,
  SubscribeAutomationParams,
  Task,
  TaskResponse,
  UpdateAutomationParams,
  ExecutorDetails,
  KernelExecutorConfig,
  ConsoleExecutorConfig,
  GenerateExecutableTypedDataParams,
  ConsoleExecutorPayload
} from "./types";
import {
  AutomationLogResponse,
  AutomationSubscription
} from "../AutomationContextFetcher/types";

const routes = {
  fetchExistingAccounts: "/user/consoles",
  generateCalldata: "/builder/generate",
  fetchAutomationSubscriptions: "/automations/subscriptions/console",
  fetchAutomationLogs: "/kernel/logs",
  indexTransaction: "/indexer/process",
  kernelTasks: "/kernel/tasks",
  kernelExecutor: "/kernel/executor",
  automationsExecutor: "/automations/executor"
};

export class VendorCaller {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "x-api-key": apiKey
      }
    });
  }

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

  async subscribeToAutomation(
    params: SubscribeAutomationParams
  ): Promise<AutomationResponse> {
    try {
      const response = await this.axiosInstance.post<AutomationResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "SUBSCRIBE",
          params
        } as AutomationRequest<SubscribeAutomationParams>
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error subscribing to automation: ${err.message}`);
      throw err;
    }
  }

  async updateAutomation(
    params: UpdateAutomationParams
  ): Promise<AutomationResponse> {
    try {
      const response = await this.axiosInstance.post<AutomationResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "UPDATE",
          params
        } as AutomationRequest<UpdateAutomationParams>
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error updating automation: ${err.message}`);
      throw err;
    }
  }

  async cancelAutomation(
    params: VendorCancelAutomationParams
  ): Promise<AutomationResponse> {
    try {
      const response = await this.axiosInstance.post<AutomationResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "CANCEL",
          params
        } as AutomationRequest<VendorCancelAutomationParams>
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error updating automation: ${err.message}`);
      throw err;
    }
  }

  async fetchAutomationSubscriptions(
    accountAddress: Address,
    chainId: number
  ): Promise<AutomationSubscription[]> {
    try {
      if (!accountAddress || !chainId) {
        throw new Error("Brahma Account address and chain ID are required");
      }

      const response = await this.axiosInstance.get<{
        data: AutomationSubscription[];
      }>(`${routes.fetchAutomationSubscriptions}/${accountAddress}/${chainId}`);

      if (!response.data.data) {
        throw new Error(
          "No subscriptions found for the given account address and chain ID"
        );
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching automation subscriptions: ${err.message}`);
      return [];
    }
  }

  async fetchAutomationLogs(
    automationId: string
  ): Promise<AutomationLogResponse[]> {
    try {
      if (!automationId) {
        throw new Error("Automation ID is required");
      }

      const response = await this.axiosInstance.get(
        `${routes.fetchAutomationLogs}/${automationId}`
      );

      if (!response.data.data) {
        throw new Error("No logs found for the given automation ID");
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching automation logs: ${err.message}`);
      return [];
    }
  }

  async indexTransaction(
    transactionHash: string,
    chainID: number
  ): Promise<void> {
    try {
      const response = await this.axiosInstance.post(
        `${routes.indexTransaction}/${transactionHash}/${chainID}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to index transaction");
      }

      console.log("Transaction indexed successfully");
    } catch (err: any) {
      console.error(`Error indexing transaction: ${err.message}`);
      throw err;
    }
  }

  async fetchTasks(
    registryId: string,
    cursor: number = 0,
    limit: number = 1
  ): Promise<Task[]> {
    try {
      const response = await this.axiosInstance.get<TaskResponse>(
        `${routes.kernelTasks}/${registryId}`,
        {
          params: { cursor, limit }
        }
      );

      if (!response?.data?.data?.tasks) {
        throw new Error("No tasks found for the given registry ID");
      }

      return response.data.data.tasks;
    } catch (err: any) {
      console.error(`Error fetching tasks: ${err.message}`);
      return [];
    }
  }

  async submitTask(
    taskRequest: SubmitTaskRequest
  ): Promise<SubmitTaskResponse> {
    try {
      const response = await this.axiosInstance.post<SubmitTaskResponse>(
        routes.kernelTasks,
        taskRequest
      );

      if (response?.status !== 200) {
        throw new Error("Failed to submit task");
      }

      return response.data;
    } catch (err: any) {
      console.error(`Error submitting task: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async fetchExecutorDetails(registryId: string): Promise<ExecutorDetails> {
    try {
      if (!registryId) {
        throw new Error("Registry ID is required");
      }

      const response = await this.axiosInstance.get<{ data: ExecutorDetails }>(
        `${routes.kernelExecutor}/${registryId}`
      );

      if (!response?.data?.data) {
        throw new Error("No executor details found for the given registry ID");
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching executor details: ${err.message}`);
      throw err;
    }
  }

  async generateKernelExecutorRegistration712Message(
    chainId: number,
    registryId: string,
    config: KernelExecutorConfig
  ) {
    return {
      types: {
        ModifyExecutor: [
          { name: "registryId", type: "string" },
          { name: "type", type: "string" },
          { name: "ttl", type: "string" },
          { name: "enable", type: "bool" }
        ]
      },
      domain: {
        chainId: chainId
      },
      message: {
        registryId: registryId,
        type: config.type,
        ttl: config.executionTTL,
        enable: true
      }
    };
  }

  async registerExecutorOnKernel(
    registryId: string,
    signature: string,
    config: KernelExecutorConfig
  ) {
    const payload = {
      registryId,
      signature,
      config
    };

    try {
      const response = await this.axiosInstance.post(
        `${routes.kernelExecutor}`,
        payload
      );

      if (response?.status !== 201)
        throw new Error("Failed to register executor on kernel");
    } catch (error) {
      throw new Error("Failed to register executor on kernel");
    }
  }

  async generateConsoleExecutorRegistration712Message(
    chainId: number,
    config: ConsoleExecutorConfig
  ) {
    return {
      types: {
        RegisterExecutor: [
          { name: "timestamp", type: "uint256" },
          { name: "executor", type: "address" },
          { name: "inputTokens", type: "address[]" },
          { name: "hopAddresses", type: "address[]" },
          { name: "feeInBPS", type: "uint256" },
          { name: "feeToken", type: "address" },
          { name: "feeReceiver", type: "address" },
          { name: "limitPerExecution", type: "bool" },
          { name: "clientId", type: "string" }
        ]
      },
      domain: {
        chainId: chainId
      },
      message: {
        ...config,
        feeInBPS: 0,
        feeToken: "0x0000000000000000000000000000000000000000"
      },
      primaryType: "RegisterExecutor"
    };
  }

  async registerExecutorOnConsole(
    signature: string,
    chainId: number,
    config: ConsoleExecutorConfig,
    name: string,
    logo: string,
    metadata: any
  ): Promise<(ConsoleExecutorPayload & { id: string; status: number }) | null> {
    const payload: ConsoleExecutorPayload = {
      config: {
        inputTokens: config.inputTokens,
        hopAddresses: config.hopAddresses,
        feeInBPS: "0",
        feeToken: "0x0000000000000000000000000000000000000000",
        feeReceiver: config.feeReceiver,
        limitPerExecution: config.limitPerExecution
      },
      executor: config.executor,
      signature: signature,
      chainId: chainId,
      timestamp: config.timestamp,
      executorMetadata: {
        id: config.clientId,
        name: name,
        logo: logo,
        metadata: metadata
      }
    };

    try {
      const response = await this.axiosInstance.post<{
        data: ConsoleExecutorPayload & { id: string; status: number };
      }>(`${routes.automationsExecutor}`, payload);

      if (response?.status !== 201)
        throw new Error("Failed to register executor on Brahma");

      return response.data.data;
    } catch (error) {
      throw new Error("Failed to register executor on Brahma");
    }
  }

  async generateExecutableDigest712Message(
    params: GenerateExecutableTypedDataParams
  ) {
    return {
      types: {
        ExecutionParams: [
          { name: "operation", type: "uint8" },
          { name: "to", type: "address" },
          { name: "account", type: "address" },
          { name: "executor", type: "address" },
          { name: "gasToken", type: "address" },
          { name: "refundReceiver", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "safeTxGas", type: "uint256" },
          { name: "baseGas", type: "uint256" },
          { name: "gasPrice", type: "uint256" },
          { name: "data", type: "bytes" }
        ],
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" }
        ]
      },
      primaryType: "ExecutionParams",
      domain: {
        name: "ExecutorPlugin",
        version: "1.0",
        chainId: params.chainId,
        verifyingContract: params.pluginAddress
      },
      message: {
        operation: params.operation,
        to: params.to,
        account: params.account,
        executor: params.executor,
        value: params.value,
        nonce: params.nonce,
        data: params.data,
        gasToken: "0x0000000000000000000000000000000000000000", // Default value
        refundReceiver: "0x0000000000000000000000000000000000000000", // Default value
        safeTxGas: "0", // Default value
        baseGas: "0", // Default value
        gasPrice: "0" // Default value
      }
    };
  }
}
