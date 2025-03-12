const path = require('path');
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: path.join(__dirname, '.env') });

// Debug logging
console.log("ETHEREUM_PRIVATE_KEY:", process.env.ETHEREUM_PRIVATE_KEY ? "Found" : "Not found");
console.log("ALCHEMY_API_KEY:", process.env.ALCHEMY_API_KEY ? "Found" : "Not found");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0"
      },
      {
        version: "0.8.28"
      }
    ]
  },
  networks: {
    // Local Ganache network
    ganache: {
      url: "http://127.0.0.1:7545",  // Default Ganache URL
      accounts: [process.env.ETHEREUM_PRIVATE_KEY]
    }
  }
};
