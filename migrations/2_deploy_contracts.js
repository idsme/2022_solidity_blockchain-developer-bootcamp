const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Token);
    deployer.deploy(Exchange, accounts[1], 10);
};
