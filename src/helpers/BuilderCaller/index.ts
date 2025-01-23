import { Communicator, Methods } from "@/types";
import {
  AddAutomationParams,
  AddToTxnBuilderParams,
  BuilderParams,
  CancelAutomationParams,
} from "./types";

export class BuilderCaller {
  private readonly communicator: Communicator;

  constructor(communicator: Communicator) {
    this.communicator = communicator;
  }

  async addToTxnBuilder(
    params: BuilderParams,
    automationName: string
  ): Promise<void> {
    if (!params || !params.transactions.length) {
      throw new Error("No transactions were passed");
    }

    const messagePayload = {
      params,
      automationName,
    };

    const response = await this.communicator.send<
      Methods.addToTxnBuilder,
      AddToTxnBuilderParams,
      void
    >(Methods.addToTxnBuilder, messagePayload);

    return response.data;
  }

  async addAutomation(params: AddAutomationParams): Promise<void> {
    const response = await this.communicator.send<
      Methods.addAutomation,
      AddAutomationParams,
      void
    >(Methods.addAutomation, params);

    return response.data;
  }

  async cancelAutomation(params: CancelAutomationParams): Promise<void> {
    const response = await this.communicator.send<
      Methods.cancelAutomation,
      CancelAutomationParams,
      void
    >(Methods.cancelAutomation, params);

    return response.data;
  }
}
