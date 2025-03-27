# Introduction

ConsoleKit is a framework that enables agents to execute complex DeFi transactions on-chain. Any automation strategy or  an agent can now transact autonomously with battle-tested security guardrails.

## Terminology
1. **Executor** : An address that is registered with ConsoleKit and is responsible for executing the transactions on behalf of the user.
2. **User** : An address that owns a Brahma account and subscribes to an executor automation flows.
3. **Brahma Account** : A safe smart contract wallet that is used by users to subscribe to an executor and execute batched transactions.
4. **Subaccount** : A safe smart contract wallet with onchain safe gaurd  that is used to isolate user funds and give execution rights to an executor with policy gaurd rails.
5. **Policy** : A set of conditions that are proposed by executor on  to restrict the executor from taking harmful actions.

## Core Components

1. **Kernel** : The orchestration engine that schedules/triggers and executes the transactions on behalf of the user.
2. **CoreActions** : Built-in interfaces for complex DeFi operations like swap, bridge, lending, borrowing across supported chains and protocols

## Features
### Native Console Actions

- Programmatic access to Console's features including cross-chain swap routing, lending operations, and position management
- Built-in interfaces for complex DeFi operations across supported chains and protocols
- Pre-built modules for common protocol integrations and standard DeFi actions

### Autonomous Strategy Development

- Create and deploy autonomous agents with custom logic for fund management
- Leverage Console's sub-account architecture for secure fund isolation
- Define precise operational parameters using the policy engine
- Access built-in execution stack for secure transaction handling
- Monitor and control agent actions through comprehensive logging


## Next Steps: [Understanding Executors →](./executor.md)
