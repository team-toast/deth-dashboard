module.exports = {
  reactStrictMode: true,
  target: "serverless",
  env: {
    ETH_RPC: "https://cloudflare-eth.com/",
    ETH_CONTRACT_ADDRESS: "0x51863Ec92BA14ede7B17fb2B053145C90E215A57",
    BLOCKCHAINS: {
      eth: "Ethereum",
    },
  },
};
