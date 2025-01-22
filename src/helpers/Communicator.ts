import { MessageFormatter } from "./MessageFormatter";
import {
  Communicator,
  InterfaceMessageEvent,
  Methods,
  SuccessResponse,
  Response,
} from "../types";

type Callback = (response: any) => void;

class InterfaceCommunicator implements Communicator {
  private callbacks = new Map<string, Callback>();
  private isServer = typeof window === "undefined";

  constructor() {
    if (!this.isServer) {
      window.addEventListener("message", this.onParentMessage);
    }
  }

  private isValidMessage = ({
    data,
    source,
  }: InterfaceMessageEvent): boolean => {
    const emptyOrMalformed = !data;
    const sentFromParentEl = !this.isServer && source === window.parent;
    return !emptyOrMalformed && sentFromParentEl;
  };

  private logIncomingMessage = (msg: InterfaceMessageEvent): void => {
    console.info(
      `ConsoleKit: A message was received from origin ${msg.origin}. `,
      msg.data
    );
  };

  private onParentMessage = (msg: InterfaceMessageEvent): void => {
    if (this.isValidMessage(msg)) {
      this.logIncomingMessage(msg);
      this.handleIncomingMessage(msg.data);
    } else {
      console.info(
        "ConsoleKit: A message was received from an unknown origin. ",
        msg.origin
      );
    }
  };

  private handleIncomingMessage = (
    payload: InterfaceMessageEvent["data"]
  ): void => {
    const { id } = payload;

    const cb = this.callbacks.get(id);
    if (cb) {
      cb(payload);

      this.callbacks.delete(id);
    }
  };

  public send = <M extends Methods, P, R>(
    method: M,
    params: P
  ): Promise<SuccessResponse<R>> => {
    const request = MessageFormatter.makeRequest(method, params);

    if (this.isServer) {
      throw new Error("Window doesn't exist");
    }

    window.parent.postMessage(request, "*");
    return new Promise((resolve, reject) => {
      this.callbacks.set(request.id, (response: Response<R>) => {
        if (!response.success) {
          reject(new Error(response.error));
          return;
        }

        resolve(response);
      });
    });
  };
}

export { InterfaceCommunicator };
