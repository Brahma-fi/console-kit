import { Chain } from "viem";
import {
  mainnet,
  arbitrum,
  base,
  swellchain,
  blast,
  mode,
  sei,
  scroll,
  berachain,
} from "viem/chains";
import { ChainConfig, SupportedChainIds } from "./types";

const SUPPORTED_CHAINS = [
  mainnet,
  arbitrum,
  base,
  berachain,
  swellchain,
  blast,
  mode,
  sei,
  scroll,
] as const satisfies Chain[];

const SUPPORTED_CHAINS_IDS = SUPPORTED_CHAINS.map(({ id }) => id);

const CHAIN_CONFIG = SUPPORTED_CHAINS.reduce((acc, chain) => {
  acc[chain.id as SupportedChainIds] = chain;
  return acc;
}, {} as ChainConfig<Chain>);

export { SUPPORTED_CHAINS, SUPPORTED_CHAINS_IDS, CHAIN_CONFIG };
