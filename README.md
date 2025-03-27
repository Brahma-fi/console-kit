## Welcome to Brahma ConsoleKit!

Brahma ConsoleKit enables developers to build automated workflows that operate securely and autonomously without requiring the writing of smart contracts or taking custody of user funds. The framework provides everything needed to create seamless workflows integrating both on-chain and off-chain elements.

### Key Features:

- **User Onboarding and Security:** Brahma abstracts the complexity of user account management, ensuring secure onboarding while maintaining full control over user assets.
- **Automated Workflow Management:** Developers can design multi-step workflows with triggers, decision-making, and security guardrails, fully abstracted by ConsoleKit.
- **No Custody:** Unlike traditional financial services, Brahma ensures that developers do not need to take custody of user funds, with users retaining full ownership and control over their assets at all times.
- **Cross-Chain Execution:** Developers can build workflows that seamlessly interact with protocols across different blockchains.
- **Off-Chain Inputs:** ConsoleKit supports off-chain data sources, such as api's, events and other sources enabling flexible interactions with various systems beyond the blockchain.
- **Agentic Workflows:** For more complex systems, Brahma ConsoleKit enables the creation of fully autonomous agentic workflows, where intelligent, on-chain agents perform tasks like yield optimization or liquidity management.

### Developer Benefits:

- **Simplified Development:** Developers can build, deploy, and scale workflows in a matter of days, cutting down 90% of traditional development time.
- **Scalability and Flexibility:** ConsoleKit allows the creation of multi-chain automated systems with combination of on-chain protocols and off-chain services.
- **Customization:** Developers can integrate off-chain logic or framework using Brahma’s flexible TypeScript SDK or native API's, abstracting built-in security, execution, and policy management tools.
- **Built-In User Accounts:** ConsoleKit provides secure, multi-chain accounts for onboarding users, managing permissions, and executing transactions automatically without the need for external solutions.

### Agentic Workflows:

For advanced use cases, developers can build **Agentic Protocols** that enable agents to autonomously execute strategies across blockchains and protocols. These agents can collaborate, optimize operations, and manage decentralized assets on behalf of users, all while adhering to user defined security policies.

Explore more on how to build [**Automated Workflows**](https://chatgpt.com/g/g-p-67ac50e1e18481919b7cc96b18369f8b-brahma-console-kit/c/link-to-automated-workflow-readme) and [**Agentic Workflows**](./README-agentic.md) using ConsoleKit.

---

Now, all references to "you" are removed, with the correct third-person language. Let me know if there are any other areas that need further adjustments!

## System Architecture & Core Concepts

The [Introduction](./docs/introduction.md) provides a comprehensive overview of ConsoleKit's components, and terminology. This section is essential reading for developers to understand:

- Core architectural components and their interactions
- Key terminologies and concepts used throughout the SDK
- Security model and policy engine fundamentals
- Integration patterns and best practices

We recommend reviewing this documentation before starting development to ensure a solid foundation in ConsoleKit's principles.

## Installation

To install the SDK, use npm or yarn:

```sh
npm install brahma-console-kit
```

or

```sh
yarn add brahma-console-kit
```

## Getting Started with Template

To quickly bootstrap your ConsoleKit project, you can use our [scaffold agent repository](https://github.com/Brahma-fi/scaffold-agent)

[![YouTube](http://i.ytimg.com/vi/pLGP0Ag1Y8M/hqdefault.jpg)](https://www.youtube.com/watch?v=pLGP0Ag1Y8M)

The scaffold repository includes a collection of example implementations showcasing how to build autonomous DeFi agents using ConsoleKit. This repository demonstrates integration patterns ranging from LLM-powered execution to automated DeFi workflows.

## Overview

### ConsoleKit

[`ConsoleKit`](./src/kit.ts) is the main class that provides access to the core functionalities of the SDK. It requires an API key and a base URL for initialization.

**Example:**

```typescript
import ConsoleKit from "brahma-console-kit";

const apiKey = "your-api-key";
const baseURL = "https://api.consolekit.com";

const consoleKit = new ConsoleKit(apiKey, baseURL);
```

### CoreActions

[`CoreActions`](./src/helpers/CoreActions/index.ts) provides core DeFi functions such as sending tokens and swapping assets, as well as fetching user information.

**Example:**

```typescript
const coreActions = consoleKit.coreActions;

async function fetchAccounts(eoa: string) {
  const accounts = await coreActions.fetchExistingAccounts(eoa);
  console.log(accounts);
}
```

### PublicDeployer

[`PublicDeployer`](./src/helpers/PublicDeployer/index.ts) handles executor subscription and brahma account deployments directly through EOAs in a gasless manner.

**Example:**

```typescript
const publicDeployer = consoleKit.publicDeployer;

async function deployStrategy(
  owner: string,
  chainId: number,
  feeToken: string
) {
  const preComputeData = await publicDeployer.fetchPreComputeData(
    owner,
    chainId,
    feeToken
  );
  console.log(preComputeData);
}
```

### AutomationContext

[`AutomationContext`](./src/helpers/AutomationContext/index.ts) manages automation services, including subscribing to, updating, and canceling automated tasks.

**Example:**

```typescript
const automationContext = consoleKit.automationContext;

async function subscribeToAutomation(params: any) {
  const response = await automationContext.subscribeToAutomation(params);
  console.log(response);
}
```

#### Fetching Automation Subscriptions

The `fetchAutomationSubscriptions` function retrieves subscriptions associated with a given account address and blockchain network. You can specify a custom metadata type, or use the default structure.

ConsoleKit provides flexible functions to fetch automation subscriptions with customizable metadata. This allows you to tailor the metadata structure to your specific needs.

- **Default Metadata**: If no template is provided, the metadata will include only `baseToken` and `every`. See the [BaseMetadata](./src/helpers/AutomationContext/types.ts#L57) type definition.
- **Custom Metadata**: Specify a template to include additional fields. See the [CustomMetadata](./src/helpers/AutomationContext/types.ts#L69) type definition.

**Example:**

```typescript
// Default metadata
const subscriptions = await automationContext.fetchAutomationSubscriptions(
  accountAddress,
  chainId
);

// Custom metadata
type CustomMetadata = { customField1?: string; customField2?: number };
const customSubscriptions =
  await automationContext.fetchAutomationSubscriptions<CustomMetadata>(
    accountAddress,
    chainId
  );
```

#### Fetching Automation Subscriptions by Registry Id

The `fetchSubscriptionsByRegistryID` function retrieves subscriptions for a specific externally owned account (EOA) and registry ID. Similar to the previous function, you can specify a custom metadata type.

**Example:**

```typescript
// Default metadata
const subscriptions = await automationContext.fetchSubscriptionsByRegistryID(
  eoa,
  registryId
);

// Custom metadata
type CustomMetadata = { customField1?: string; customField2?: number };
const customSubscriptions =
  await automationContext.fetchSubscriptionsByRegistryID<CustomMetadata>(
    eoa,
    registryId
  );
```

This overview provides a basic understanding of how to initialize and use the main classes in the `ConsoleKit` SDK. For more detailed usage, refer to the documentation or explore the source code.

## Brahma Accounts Security Audits

Security audits performed on Brahma accounts. Please refer to the following reports for detailed security analysis and findings:

- [Spearbit Audit Report](https://github.com/spearbit/portfolio/blob/master/pdfs/Brahma-Spearbit-Security-Review.pdf)
- [Code4rena Audit Report](https://code4rena.com/audits/2023-10-brahma#top)
- [Ackee Blockchain Audit Report](https://github.com/Ackee-Blockchain/public-audit-reports/blob/master/2023/ackee-blockchain-brahma-console-v2-report.pdf)

## License

This project is licensed under the MIT License.

### Note

Safe Agenthon api-key: `65832024-c1f4-48d2-81e6-3460f2722600` and url: `https://dev.console.fi/`
