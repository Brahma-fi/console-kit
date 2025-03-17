// __tests__/CoreActions.test.ts
import dotenv from "dotenv";
import { scroll } from "viem/chains";

import { CoreActions } from "../src/helpers/CoreActions";

dotenv.config(); // Load environment variables

describe("CoreActions", () => {
  let coreActions: CoreActions;

  const apiKey = process.env.API_KEY as string;
  const baseURL = process.env.BASE_URL as string;

  const eoa = "0xD870765964C1F2d5f45D9542881afA2AfDfbD01A";
  const chainId = scroll.id;
  const ownersCount = 1;
  const threshold = 1;

  const consoleAddress = "0x2d3bdafbb56dab49787dc33581f1f26ab95500c5";
  const transactions = [
    {
      to: "0x1234567890abcdef1234567890abcdef12345678",
      data: "0x",
      value: "0",
      operation: 0,
    },
  ];

  beforeAll(() => {
    if (!apiKey || !baseURL) {
      throw new Error("Missing API_KEY or BASE_URL in environment variables");
    }
    coreActions = new CoreActions(apiKey, baseURL);
  });

  it("should fetch existing accounts for a given EOA", async () => {
    const accounts = await coreActions.fetchExistingAccounts(eoa, {
      chainId,
      ownersCount,
      threshold,
    });

    expect(accounts.length).toBeGreaterThan(0);
  });

  it("should execute a safe transaction and return encoded data", async () => {
    const result = await coreActions.executeSafeTransaction(
      eoa,
      consoleAddress,
      chainId,
      transactions
    );

    expect(result.to).toBe(consoleAddress);
    expect(result.value).toBe("0");
    expect(result.data).toBeDefined(); // Check that data is encoded
  });
});
