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

    console.log({ accounts });

    expect(accounts.length).toBeGreaterThan(0);
  });
});
