# Understanding Subscriptions

Subscribing to automation in Console Kit enables users to delegate specific permissions to executors through a streamlined onboarding process. The SDK abstracts the complexity of account creation, fund transfers, and permission management into simple, secure operations.

## Gasless Onboarding via Precomputed Accounts

When subscribing to automation, users can start with just their EOA wallet and quickly get set up through a precomputed address flow, allowing users to deposit funds first while account setup happens automatically in the background:

1. User initiates subscription with their EOA address
2. Console Kit computes the deterministic Brahma account address
3. User transfers funds to the precomputed address
4. User signs subscription message to authorize executor access
5. Now deployBrahmaAccount() method is called from the sdk, which gaslessly deploys everything and sets everything up for execution

The entire process is abstracted by the Console Kit SDK, providing a seamless experience while maintaining security through policy enforcement.
Here is a [sample script](https://github.com/Brahma-fi/scaffold-agent/blob/main/kernel-workflow/src/deploy-automation-account.ts) demonstrating the whole flow, which includes

1. fetching precomputed address

```ts
await _consoleKit.publicDeployer.fetchPreComputeAddress(
  _ownerEoa,
  _chainId,
  _inputToken
);
```

2. generating subaccount params

```ts
const accountGenerationData =
    await _consoleKit.publicDeployer.generateAutomationSubAccount(
      _ownerEoa,
      _precomputeData.precomputedAddress,
      _chainId,
      _executorRegistryId,
      feeToken: _inputToken, // we pay fees in input token itself
      _precomputeData.feeEstimate,
      tokens, // [] of tokens to transfer
      amounts, // [] of amounts
      {
        duration: automationDuration, // duration for this policy
        tokenLimits: tokenLimits // token limits for each token
      },
      // metadata which would be passed to executor, this can be used to signal executor users automation preferences
      {
        every: "60s", // configure to required automation interval
        receiver: "0xAE75B29ADe678372D77A8B41225654138a7E6ff1", // configure to required receiver address
        transferAmount: "200000" // configure to required transfer amount per iteration
      }
    );
```

3. deploy the account

```ts
const deployData = await _consoleKit.publicDeployer.deployBrahmaAccount(
  _ownerEoa,
  _chainId,
  _executorRegistryId,
  subscriptionDraftID,
  subAccountPolicyCommit,
  _inputToken,
  tokens,
  amounts,
  deploymentSignature,
  _precomputeData.feeEstimateSignature,
  _precomputeData.feeEstimate,
  {}
);
```

## Under the Hood

When a user subscribes to automation, several key operations occur behind the scenes:

![Subscription](./img/subscription.png)

### Account Creation

A Brahma account is deterministically created for the user's EOA address. This account serves as the primary container for automated operations and is secured by Console's policy framework.

### Subaccount Generation

A dedicated subaccount is created specifically for the automation strategy. This provides:

- Isolation of automated operations
- Specific policy enforcement
- Clear separation of responsibilities

### Fund Management

Once accounts are set up:

- User funds are transferred to the Brahma account
- Tokens are moved to appropriate subaccounts
- All movements are policy-protected

### Permission Delegation

Finally, the executor receives carefully scoped permissions:

- Access is granted only to designated subaccounts
- All actions must comply with defined policies
- Permissions can be revoked at any time

### [← Understanding Executors](./executor.md) | [Hosted Workflows →](./kernel.md)
