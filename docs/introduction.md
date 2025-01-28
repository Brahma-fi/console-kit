# Console Kit

Console Kit is an SDK for building autonomous DeFi agents while providing programmatic access to Console's core DeFi utilities. The SDK enables developers to create sophisticated agents that can manage user funds and execute complex strategies, all secured by Console's policy engine and execution infrastructure. Essential DeFi primitives like optimal swap routing, MEV-protected execution, and cross-chain liquidity management are exposed as modular functions, enabling flexible integration paths from simple utility use to full autonomous agents.

The SDK abstracts away the underlying complexity of sub-accounts, policy management, and transaction execution, allowing developers to focus on building powerful autonomous strategies while inheriting Console's security features.

## Core Features

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

## Examples & Use-Cases

Here's what you can build with Console Kit:

### Agentic Accounts

**What:** Creates an autonomous agent capable of managing user funds and executing actions based on pre-defined strategies and market conditions, all secured by policy guards. The agent can interact with various DeFi protocols, manage positions, and optimize yields while operating within strict security parameters.

**Why:** Enables true hands-off automation of complex DeFi strategies while maintaining security through policy-driven controls, allowing users to benefit from autonomous management without compromising on safety.

**How:**

- Policy Guards define strict boundaries for agent actions (transaction limits, approved protocols, maximum position sizes)
- The agent monitors market conditions, protocol states, and on-chain opportunities
- Autonomous decision-making occurs within policy constraints
- Execution happens through secure executors with specific permissions
- All actions are logged and can be monitored through a dashboard

### Abstracted Lending Account

**What:** Creates an intelligent lending optimizer that dynamically manages positions across multiple lending protocols through a unified interface, incorporating real-time market analysis and risk assessment capabilities.

**Why:** Maximizes lending efficiency and returns while minimizing risks through automated market analysis and position management, enabling users to capitalize on the best opportunities across the entire DeFi lending landscape.

**How:**

- Real-time rate indexing across all major lending protocols
- Dynamic risk scoring based on protocol TVL, utilization rates, and historical stability
- Automated position rebalancing with gas-optimized execution
- Custom risk parameters and yield thresholds per asset
- Integrated liquidation protection through multi-protocol position monitoring

### Rekt SAFU Account

**What:** Establishes an advanced security system that provides proactive protection against protocol exploits and market manipulation events, incorporating multiple layers of defensive mechanisms and automated response protocols.

**Why:** Creates a robust defense against the increasing sophistication of DeFi attacks, ensuring asset safety through automated threat detection and rapid response capabilities.

**How:**

- Multi-source threat detection integrating FORTA, Hypernative, and custom monitoring systems
- Tiered response protocols based on threat severity and confidence levels
- Advanced slippage management with MEV-aware execution
- Automated circuit breakers for suspicious activity
- Cross-chain emergency withdrawal coordination with fallback options

### Leverage Management Account

**What:** Deploys an intelligent position manager that actively maintains optimal leverage across multiple protocols while implementing sophisticated risk management strategies and automated defense mechanisms.

**Why:** Protects leveraged positions against market volatility while maximizing capital efficiency through dynamic position management and automated risk mitigation.

**How:**

- Real-time health factor monitoring with predictive analytics
- Dynamic collateral management across multiple protocols
- Automated position scaling based on market conditions
- Custom risk parameters with gradual position adjustment logic

### Account Recovery System

**What:** Implements a sophisticated recovery framework with multi-stage activation protocols and configurable security measures to ensure reliable fund recovery while preventing unauthorized access.

**Why:** Provides a robust safety net against various access loss scenarios while maintaining high security standards and preventing potential exploitation of the recovery mechanism.

**How:**

- Multi-factor inactivity verification system
- Graduated recovery stages with increasing security checks
- Configurable timeframes and recovery thresholds
- Multiple recovery address options with priority ordering
- Automated verification of recovery address health before transfers

### Next Steps: [Understanding Executors →](./executor.md)
