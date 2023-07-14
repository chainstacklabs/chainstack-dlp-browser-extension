module.exports = [
  {
    setting: "creditCard",
    pattern: /\b(\d{4} ?){4}\b/g,
    placeholder: "**CREDIT_CARD**",
  },
  {
    setting: "jwt",
    pattern: /eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.?[a-zA-Z0-9-_]+/g,
    placeholder: "**JWT**",
  },
  {
    setting: "ethPrivateKey",
    pattern: /\b0x[a-fA-F0-9]{64}\b/g,
    placeholder: "**ETH_PRIVATE_KEY**",
  },
  {
    setting: "ethAddress",
    pattern: /\b0x[a-fA-F0-9]{40}\b/g,
    placeholder: "**ETH_ADDRESS**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\bhttps:\/\/(arbitrum-mainnet|avalanche-mainnet|goerli|sepolia)\.infura\.io\/v3\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\bhttps:\/\/(ethereum-mainnet|polygon-mainnet|bsc-mainnet)\.core\.chainstack\.com\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\bhttps:\/\/(eth-mainnet|arb-mainnet|polygon-mainnet)\.g\.alchemy\.com\/v2\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\bhttps:\/\/nd-\d{3}-\d{3}-\d{3}\.p2pify\.com\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\b(wss):\/\/(ethereum-mainnet|polygon-mainnet|bsc-mainnet)\.core\.chainstack\.com\/ws\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\b(wss):\/\/(eth-mainnet|arb-mainnet|polygon-mainnet)\.g\.alchemy\.com\/v2\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "rpcEndpoint",
    pattern:
      /\b(wss):\/\/ws-nd-\d{3}-\d{3}-\d{3}\.p2pify\.com\/[a-zA-Z0-9]{32}\b/g,
    placeholder: "**RPC_ENDPOINT**",
  },
  {
    setting: "phoneNumber",
    pattern: /\(\d{3}\)\s\d{3}-\d{4}/g,
    placeholder: "**PHONE_NUMBER**",
  },
  {
    setting: "apiKey",
    pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    placeholder: "**API_KEY**",
  },
  {
    setting: "apiKey",
    pattern: /\bBearer [A-Za-z0-9]+\b/g,
    placeholder: "**API_KEY**",
  },
  {
    setting: "apiKey",
    pattern: /\b[A-Za-z0-9+/=]{40}\b/g,
    placeholder: "**API_KEY**",
  },
  {
    setting: "apiKey",
    pattern: /\b[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]*\b/g,
    placeholder: "**API_KEY**",
  },
  {
    setting: "apiKey",
    pattern: /\bAKIA[A-Za-z0-9]{16}\b/g,
    placeholder: "**API_KEY**",
  },
  {
    setting: "apiKey",
    pattern: /\b[a-zA-Z0-9]{32}\b/g,
    placeholder: "**API_KEY**",
  },
];
