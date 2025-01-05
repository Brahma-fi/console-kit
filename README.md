# Introduction 

Brahma sdk (bhsdk) is platform that enable agents, developers to operate, transact onchain autonomously. Bhsdk solves many problems that developers and agents face while performing onchain interactions. Most of these revolve around these themes:
1. Secure Interactions
2. Simplified Development
3. Scalable Operations

## Secure Interactions
### How does Bhsdk enable secure interactions?
Bhsdk use's account as the main interaction point with the platform. The account is built with safe [smart contract wallet](https://safe.global/) . The account leverages the [safe gaurds](https://docs.safe.global/advanced/smart-account-guards) and [safe modules](https://docs.safe.global/advanced/smart-account-modules) features to enable programmatic executions without giving up the full custody of the account. The gaurd is powered by `Policy engine` that validates onchain interactions via state updates, transaction simulations and logs.  

## Simplified Development
### How does Bhsdk simplify application code for onchain interactions ?
By shifting the core part of block chain interaction like protcol routes, failed rpc calls, nonce management, gas estimates to platform. There's less application code for dev's to manage and they can focus on their specific usecase and business logic. The native abstractions like tools, workflows and context layer makes it easy to repurpose existing components and build completely new components reducing overhead during development time. 
Coupled with api driven design, developers can use the platform via programming language of their choice. 

## Scalable Operations
### How does Bhsdk help build scalable operations
Devs can build scalable operations that build on one chain with minimal changes to be expanded easily to other chains or entirely multichain. Compared to pure smart contract based developement flow which is often expensive with audit costs and slower iterations.  The account centric model, developers to iterate faster and adapt the changes as per their usecase. Once built the same code can be used by different set of users with thier specific prefrences while infra is taken care by Bhsdk reducing maintainence overhead for developers.  

# Getting Started
Bhsdk uses brahma account as the main mode of interaction. The account is assisted by tools, workflows and context layer to operate onchain in efficient and secure manner. The core components are open in nature so dev's can add new capabilities from exisiting ones. 

```mermaid
graph TD
    subgraph BHSDK
        A[Account] 
        A --> E[Tools]
        A --> D[Workflows]
        A --> C[Context Layer]

        subgraph Tool Components
            PP[Protocol Parser]
            R1[Relayer]
            T[Template]
        end
        
        subgraph Context Layer Components
            CL[Data Providers Money/NFTs]
            DP[Debank Protocol Details]
            AP[Account Position]
        end
        
        subgraph Workflow Components
            B2[Builder Kit]
            P[Policy Engine]
            R2[Relayer]
            I[Indexer]
        end
        
        C --- CL
        C --- DP
        C --- AP
        
        D --- P
        D --- R2
        D --- I
        D --- B2

        E --- PP
        E --- R1
        E --- T
    end
```

# Tools
Tools are the building blocks of the platform. They are used to perform one time specific transactions with the onchain protocols. Tools are built using the parameters as input and execution calldata as output. Tools have the following structure: 
- Input: {`id`, `params`}
- Function: {
    - Call data api's for constructing protocol fuctions based on `params`
    - Constructing the final batched calldata for all actions 
}
- Output: {`calldata`}

All the tools are organised into `Templates` so they have definitions that ensure enable them to called either via API or directly as tool by Agent. 


# Workflows
Workflows are series of onchain interactions which are trigger or scheduled based. They provide good abstraction to the underlying blockchain interactions so devs can focuse on the highlevel operation logic while getting the benefits of reliable execution in pure non-custodial manner. Workflow's are built with `BuilderKit` as core component that uses the `Policy Engine` for validating actions, `Relayer` for gasfree fault tolerant transactions across multiple chains, `Indexer` for reacting based on onchian events. Dev's can use the public workflows to build and customise it to their own usecase. They can run these workflows either on their infra or hosted one from Brahma. 

# Context Layer
Context layer is integration repository that helps fetch data from different providers. This is used by `Workflows` and `Tools` to have realtime information for their operations. The info falls under two categories: 
1. Onchain: Protocol Specific info, Account Specific Info from providers like Defillama, DeBank, Kaito. 
2. Offchain: This would be from social platforms like Twitter, Telegram, Discord, Coingecko. 


