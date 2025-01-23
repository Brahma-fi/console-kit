import axios, { AxiosInstance } from "axios";
import { Address } from "viem";
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
} from "./types";
import {
  AutomationLogResponse,
  AutomationSubscription,
} from "../AutomationContextFetcher/types";

const routes = {
  fetchExistingAccounts: "/user/consoles",
  generateCalldata: "/builder/generate",
  fetchAutomationSubscriptions: "/automations/subscriptions/console",
  fetchAutomationLogs: "/kernel/logs",
  indexTransaction: "/indexer/process",
  kernelTasks: "/kernel/tasks",
};

export class VendorCaller {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "x-api-key": apiKey,
      },
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
          params,
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
          params,
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
          params,
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
          params: { cursor, limit },
        }
      );

      if (!response.data.data.tasks) {
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

      if (response.status !== 200) {
        throw new Error("Failed to submit task");
      }

      return response.data;
    } catch (err: any) {
      console.error(`Error submitting task: ${err.message}`);
      return { success: false, message: err.message };
    }
  }
}
