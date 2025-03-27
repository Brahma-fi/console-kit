## Welcome to Brahma ConsoleKit!

Brahma ConsoleKit equips developers with the tools to build **automated** and **agentic workflows** on-chain, enabling secure, autonomous operations without the need for custom smart contract development or managing user funds. It provides a framework for creating multi-step, cross-chain automated workflows that users can subscribe to, while retaining full control of their assets.

Developers can focus on building logic and workflows, while ConsoleKit handles the complexities of security, execution, and automation.

### Key Features

- **User Custody & Delegated Execution:**
    
    Users maintain full custody of their assets in their accounts, delegating execution permissions to workflows with defined restrictions.
    
- **Simplified Infrastructure:**
    
    Account management, policy enforcement, execution, and RPC management are all handled by ConsoleKit, eliminating the need for developers to manage these components manually.
    
- **DeFi Primitives & Cross-Chain Integration:**
    
    Modular functions for DeFi primitives, such as optimal routing, MEV protection, and cross-chain liquidity, are exposed for easy integration into workflows.
    
- **On-Chain Policy Enforcement:**
    
    Prevent unauthorized transactions and ensure compliance of the workflow with security policies.
    
- **Interface Agnostic:**
    
    Expose workflows on any interface, whether it's a website, mobile app, or custom frontend, enabling seamless user experiences.
    
- **Cross-Chain Capabilities:**
    
    Manage interactions across multiple blockchains using a single programmable account, allowing for flexible cross-chain workflows.
    

### Differences Between Automated and Agentic Workflows

1. **Automated Workflows**
    - Automate multi-step transactions onchain with any offchain trigger logic, such as bots or external scripts.
    - Example: A workflow that automatically rebalances assets between two DeFi protocol positions based on set conditions.
    
2. **Agentic Workflows**
    - Enable intelligent, multi-step reasoning in workflows using LLMs or any other AI framework.
    - Support for custom models or frameworks of choice, allowing for more sophisticated decision-making and execution.
    - Example: An agent that optimizes yield across multiple vaults while adapting to market conditions, adjusting collateral, and maintaining risk thresholds.
    
    *Future roadmap: Brahma will support cross-agent interactions, enabling complex, multi-agent collaboration and coordination.*
    

### Developer Benefits:

- **Simplified Development:** Focus on building workflows and logic without worrying about the complex mechanics of user accounts, workflow management and execution, protocol integration, or security. Cut 90% of development time.
- **Customization:** Developers can integrate offchain logic or frameworks using Brahma’s flexible TypeScript SDK or native API's, abstracting built-in security, execution, and policy management tools.
- **Scalable & Secure:** ConsoleKit handles user onboarding, cross-chain interactions, and security checks, allowing developers to focus on logic and functionality.
- **Built-In User Accounts:** ConsoleKit provides secure, multi-chain accounts for onboarding users, managing permissions, and executing transactions automatically without the need for external solutions.

---

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

Check out the ConsoleKit video explainer and setup workshop below
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
