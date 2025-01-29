import {
  InterfaceCommunicator,
  AutomationContext,
  PublicDeployer,
  CoreActions,
} from "./helpers";
import { Address, Communicator, Methods, UserClientFactory } from "./types";
import { ADDRESSES } from "./constants";

export default class ConsoleKit {
  public readonly executorPlugin: Address;
  public readonly automationContext: AutomationContext;
  public readonly publicDeployer: PublicDeployer;
  public readonly coreActions: CoreActions;

  private readonly communicator: Communicator;
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor(apiKey: string, baseURL: string) {
    this.validateInputs(apiKey, baseURL);

    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.executorPlugin = this.determineExecutorPlugin(baseURL);

    this.communicator = new InterfaceCommunicator();
    this.publicDeployer = new PublicDeployer(this.apiKey, this.baseURL);
    this.automationContext = new AutomationContext(this.apiKey, this.baseURL);
    this.coreActions = new CoreActions(this.apiKey, this.baseURL);
  }

  private validateInputs(apiKey: string, baseURL: string): void {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    if (!baseURL) {
      throw new Error("Base URL is required");
    }
  }

  private determineExecutorPlugin(baseURL: string): Address {
    return baseURL.includes("dev")
      ? ADDRESSES.EXECUTOR_PLUGIN.DEV
      : ADDRESSES.EXECUTOR_PLUGIN.PROD;
  }

  async getClientFactory(): Promise<UserClientFactory> {
    const response = await this.communicator.send<
      Methods.getClientFactory,
      undefined,
      UserClientFactory
    >(Methods.getClientFactory, undefined);

    return response.data;
  }
}
