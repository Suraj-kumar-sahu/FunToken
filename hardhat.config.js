require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const https_url = "https://eth-goerli.g.alchemy.com/v2/tRzmU35ytd5k2OiNkl-4tMV2SsJvr-XE" ;
const private_key = "ce4111d66627d7f0e832585a5e689a69b35f3f4bae45ea5ccc708dedfc6c502f" ;

module.exports = {
  solidity: "0.8.9",
  networks:{
    goerli:{
      url: https_url,
      accounts: [private_key]
    }
  }
};
