import {
  InterfaceCommunicator,
  AutomationContext,
  BuilderCaller,
  PublicDeployer,
  CoreActions,
} from "./helpers";
import { Communicator, Methods, UserClientFactory } from "./types";

export default class ConsoleKit {
  private readonly communicator: Communicator;
  private readonly apiKey: string;
  private readonly baseURL: string;

  public automationContext: AutomationContext;
  public builderCaller: BuilderCaller;
  public publicDeployer: PublicDeployer;
  public coreActions: CoreActions;

  constructor(apiKey: string, baseURL: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!baseURL) {
      throw new Error("Base url is required");
    }

    this.apiKey = apiKey;
    this.baseURL = baseURL;

    this.communicator = new InterfaceCommunicator();
    this.builderCaller = new BuilderCaller(this.communicator);
    this.publicDeployer = new PublicDeployer(this.apiKey, this.baseURL);
    this.automationContext = new AutomationContext(this.apiKey, this.baseURL);
    this.coreActions = new CoreActions(this.apiKey, this.baseURL);
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
