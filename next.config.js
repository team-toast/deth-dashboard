module.exports = {
  reactStrictMode: true,
  target: "serverless",
  env: {
    ETH_RPC: "https://cloudflare-eth.com/",
    ETH_CONTRACT_ADDRESS: "0x8D213dc5Cc6c3D2746E2B90a2D1C9E589ebCb532",
    BLOCKCHAINS: {
      eth: "Ethereum",
    },
  },
};
