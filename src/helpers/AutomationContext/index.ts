import axios, { AxiosInstance } from "axios";
import { Address, zeroAddress } from "viem";

import {
  AutomationLogResponse,
  AutomationSubscription,
  ConsoleExecutorConfig,
  ConsoleExecutorPayload,
  ConsoleExecutorRegistration712Message,
  ExecutableDigest712Message,
  ExecutorDetails,
  GenerateExecutableTypedDataParams,
  KernelExecutorConfig,
  KernelExecutorRegistration712Message,
  SubmitTaskRequest,
  SubmitTaskResponse,
  SubscribeAutomationParams,
  Task,
  TaskResponse,
  UpdateAutomationParams,
  VendorCancelAutomationParams,
  WorkflowStateResponse,
} from "./types";
import {
  GenerateCalldataResponse,
  GeneratePayload,
} from "../CoreActions/types";
import routes from "@/routes";

export class AutomationContext {
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
   * Subscribes to an automation service by generating the necessary calldata.
   *
   * @param {SubscribeAutomationParams} params - The parameters required to subscribe to the automation service.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the subscription process fails.
   */
  async subscribeToAutomation(
    params: SubscribeAutomationParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "SUBSCRIBE",
          params,
        } as GeneratePayload<SubscribeAutomationParams, "SUBSCRIBE">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error subscribing to automation: ${err.message}`);
      throw err;
    }
  }

  /**
   * Updates an existing automation service by generating the necessary calldata.
   *
   * @param {UpdateAutomationParams} params - The parameters required to update the automation service.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the update process fails.
   */
  async updateAutomation(
    params: UpdateAutomationParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "UPDATE",
          params,
        } as GeneratePayload<UpdateAutomationParams, "UPDATE">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error updating automation: ${err.message}`);
      throw err;
    }
  }

  /**
   * Cancels an existing automation service by generating the necessary calldata.
   *
   * @param {VendorCancelAutomationParams} params - The parameters required to cancel the automation service.
   * @returns {Promise<GenerateCalldataResponse>} A promise that resolves to a GenerateCalldataResponse object containing the transaction data.
   * @throws Will throw an error if the cancellation process fails.
   */
  async cancelAutomation(
    params: VendorCancelAutomationParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "CANCEL",
          params,
        } as GeneratePayload<VendorCancelAutomationParams, "CANCEL">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error updating automation: ${err.message}`);
      throw err;
    }
  }

  /**
   * Fetches automation subscriptions associated with a given account address and blockchain network.
   *
   * @param {Address} accountAddress - The address of the account to fetch subscriptions for.
   * @param {number} chainId - The ID of the blockchain network.
   * @returns {Promise<AutomationSubscription[]>} A promise that resolves to an array of AutomationSubscription objects.
   * @throws Will return an empty array if no subscriptions are found or if an error occurs during the fetch.
   */
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

  /**
   * Fetches logs for a specific automation using its ID.
   *
   * @param {string} automationId - The unique identifier of the automation to fetch logs for.
   * @returns {Promise<AutomationLogResponse[]>} A promise that resolves to an array of AutomationLogResponse objects.
   * @throws Will return an empty array if no logs are found or if an error occurs during the fetch.
   */
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

  /**
   * Fetches tasks associated with a given registry ID.
   *
   * @param {string} registryId - The unique identifier of the registry to fetch tasks for.
   * @param {number} [cursor=0] - The cursor for pagination, default is 0.
   * @param {number} [limit=1] - The maximum number of tasks to fetch, default is 1.
   * @returns {Promise<Task[]>} A promise that resolves to an array of Tasks.
   * @throws Will return an empty array if no tasks are found or if an error occurs during the fetch.
   */
  async fetchTasks(
    registryId: string,
    cursor: number = 0,
    limit: number = 1
  ): Promise<Task[]> {
    try {
      const response = await this.axiosInstance.get<TaskResponse>(
        `${routes.kernelTasks}/${registryId}`,
        {
          params: { cursor, limit },
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

  /**
   * Submits a task request to the automation system.
   *
   * @param {SubmitTaskRequest} taskRequest - The request object containing task details to be submitted.
   * @returns {Promise<SubmitTaskResponse>} A promise that resolves to the response indicating the success or failure of the task submission.
   * @throws Will return an error message if the task submission fails.
   */
  async submitTask(
    taskRequest: SubmitTaskRequest
  ): Promise<SubmitTaskResponse> {
    try {
      const response = await this.axiosInstance.post<SubmitTaskResponse>(
        routes.kernelTasks,
        taskRequest
      );

      if (response?.status !== 202) {
        throw new Error("Failed to submit task");
      }

      return response.data;
    } catch (err: any) {
      console.error(`Error submitting task: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  /**
   * Fetches the details of an executor associated with a given registry ID.
   *
   * @param {string} registryId - The unique identifier of the registry to fetch executor details for.
   * @returns {Promise<ExecutorDetails>} A promise that resolves to the executor details.
   * @throws Will throw an error if the registry ID is not provided or if the executor details cannot be retrieved.
   */
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

  /**
   * Generates a structured data message for registering a kernel executor using EIP-712.
   *
   * @param {number} chainId - The ID of the blockchain network.
   * @param {string} registryId - The registry ID for the executor.
   * @param {KernelExecutorConfig} config - The configuration details for the kernel executor.
   * @returns {KernelExecutorRegistration712Message} The EIP-712 structured data for registering the kernel executor.
   */
  async generateKernelExecutorRegistration712Message(
    chainId: number,
    registryId: string,
    config: KernelExecutorConfig
  ): Promise<KernelExecutorRegistration712Message> {
    return {
      types: {
        ModifyExecutor: [
          { name: "registryId", type: "string" },
          { name: "type", type: "string" },
          { name: "ttl", type: "string" },
          { name: "enable", type: "bool" },
        ],
      },
      domain: {
        chainId: chainId,
      },
      message: {
        registryId: registryId,
        type: config.type,
        ttl: config.executionTTL,
        enable: true,
      },
    };
  }

  /**
   * Registers an executor on the kernel with the specified configuration.
   *
   * @param {string} registryId - The unique identifier of the registry where the executor will be registered.
   * @param {string} signature - The signature required for registering the executor.
   * @param {KernelExecutorConfig} config - The configuration details for the kernel executor.
   * @throws Will throw an error if the registration fails.
   */
  async registerExecutorOnKernel(
    registryId: string,
    signature: string,
    config: KernelExecutorConfig
  ) {
    const payload = {
      registryId,
      signature,
      config,
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

  /**
   * Generates a structured data message for registering a console executor using EIP-712.
   *
   * @param {number} chainId - The ID of the blockchain network.
   * @param {ConsoleExecutorConfig} config - The configuration details for the console executor.
   * @returns {Object} An object containing the EIP-712 structured data for registering the executor.
   */
  async generateConsoleExecutorRegistration712Message(
    chainId: number,
    config: ConsoleExecutorConfig
  ): Promise<ConsoleExecutorRegistration712Message> {
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
          { name: "clientId", type: "string" },
        ],
      },
      domain: {
        chainId: chainId,
      },
      message: {
        ...config,
        feeInBPS: 0,
        feeToken: zeroAddress,
      },
      primaryType: "RegisterExecutor",
    };
  }

  /**
   * Registers an executor on the console with the specified configuration and metadata.
   *
   * @param {string} signature - The signature required for registering the executor.
   * @param {number} chainId - The ID of the blockchain network.
   * @param {ConsoleExecutorConfig} config - The configuration details for the console executor.
   * @param {string} name - The name of the executor.
   * @param {string} logo - The logo URL or identifier for the executor.
   * @param {any} metadata - Additional metadata associated with the executor.
   * @returns {Promise<(ConsoleExecutorPayload & { id: string; status: number }) | null>} A promise that resolves to the registered executor details, including ID and status, or null if registration fails.
   * @throws Will throw an error if the registration fails.
   */
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
        feeInBPS: 0,
        feeToken: zeroAddress,
        feeReceiver: config.feeReceiver,
        limitPerExecution: config.limitPerExecution,
      },
      executor: config.executor,
      signature: signature,
      chainId: chainId,
      timestamp: config.timestamp,
      executorMetadata: {
        id: config.clientId,
        name: name,
        logo: logo,
        metadata: metadata,
      },
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

  /**
   * Generates a structured data message for an executable digest using EIP-712.
   *
   * @param {GenerateExecutableTypedDataParams} params - The parameters required to generate the executable digest.
   * @returns {Promise<ExecutableDigest712Message>} A promise that resolves to the EIP-712 structured data for the executable digest.
   */
  async generateExecutableDigest712Message(
    params: GenerateExecutableTypedDataParams
  ): Promise<ExecutableDigest712Message> {
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
          { name: "data", type: "bytes" },
        ],
      },
      primaryType: "ExecutionParams",
      domain: {
        name: "ExecutorPlugin",
        version: "1.0",
        chainId: params.chainId,
        verifyingContract: params.pluginAddress,
      },
      message: {
        operation: params.operation,
        to: params.to,
        account: params.account,
        executor: params.executor,
        value: params.value,
        nonce: params.nonce,
        data: params.data,
        gasToken: zeroAddress, // Default value
        refundReceiver: zeroAddress, // Default value
        safeTxGas: "0", // Default value
        baseGas: "0", // Default value
        gasPrice: "0", // Default value
      },
    };
  }

  /**
   * Fetches the nonce for a specific executor on a given automation account and blockchain network.
   *
   * @param {Address} automationAccount - The address of the automation account.
   * @param {Address} executor - The address of the executor.
   * @param {number} chainId - The ID of the blockchain network.
   * @returns {Promise<string>} A promise that resolves to the nonce value for the executor.
   * @throws Will throw an error if the parameters are invalid or if the nonce cannot be retrieved.
   */
  async fetchExecutorNonce(
    automationAccount: Address,
    executor: Address,
    chainId: number
  ): Promise<string> {
    try {
      if (!automationAccount || !executor || !chainId) {
        throw new Error("Invalid params to get executor nonce");
      }

      const response = await this.axiosInstance.get<{
        data: string;
      }>(`${routes.executorNonce}/${executor}/${chainId}/${automationAccount}`);

      if (!response?.data?.data) {
        throw new Error("Executor nonce not found");
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching executor nonce: ${err.message}`);
      throw err;
    }
  }

  /**
   * Fetches the state of a workflow using its task ID.
   *
   * @param {string} taskId - The unique identifier of the task for which the workflow state is to be fetched.
   * @returns {Promise<WorkflowStateResponse>} A promise that resolves to the workflow state response.
   * @throws Will throw an error if the task ID is not provided or if the workflow state cannot be retrieved.
   */
  async fetchWorkflowState(taskId: string): Promise<WorkflowStateResponse> {
    try {
      if (!taskId || taskId === "") {
        throw new Error("TaskID is required to get workflow state");
      }

      const response = await this.axiosInstance.get<{
        data: WorkflowStateResponse;
      }>(`${routes.workflowStatus}/${taskId}`);

      if (!response?.data?.data) {
        throw new Error("Workflow state not found");
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching workflow state: ${err.message}`);
      throw err;
    }
  }
}
