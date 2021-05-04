require("@nomiclabs/hardhat-waffle");

const API_KEY = "c0abb279622d41db85862532f328e0c1";
const PRIVATE_KEY = "54de4ee3dbc49da32d5b6398b32bdb23698d62cab1b5f208b202a6b5e770c830";

module.exports = {
  solidity: "0.6.6",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};