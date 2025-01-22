import {
  ErrorResponse,
  Methods,
  MethodToResponse,
  RequestId,
  SDKRequestData,
  SuccessResponse,
} from "../types";
import { generateRequestId } from "../utils";

const getSDKVersion = (): string => "1.0.0";

class MessageFormatter {
  static makeRequest = <M extends Methods = Methods, P = unknown>(
    method: M,
    params: P
  ): SDKRequestData<M, P> => {
    const id = generateRequestId();

    return {
      id,
      method,
      params,
      env: {
        sdkVersion: getSDKVersion(),
      },
    };
  };

  static makeResponse = (
    id: RequestId,
    data: MethodToResponse[Methods],
    version: string
  ): SuccessResponse => ({
    id,
    success: true,
    version,
    data,
  });

  static makeErrorResponse = (
    id: RequestId,
    error: string,
    version: string
  ): ErrorResponse => ({
    id,
    success: false,
    error,
    version,
  });
}

export { MessageFormatter, getSDKVersion };
