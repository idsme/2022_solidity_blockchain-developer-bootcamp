const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

// TODO IDSME CLean up this file if it now works perfectly.

// Working 15% of the time correctly timing issue.
// module.exports = function(deployer, network, accounts) {
//     return deployer.deploy(Token).then(function() {
//         return deployer.deploy(Exchange, accounts[1], 10, Token.address);
//     });
// };


module.exports = async function(deployer, network, accounts) {
    // Deploy Mock DAI Token
    await deployer.deploy(Token)
    const token = await Token.deployed()

    // Deploy Dapp Token
    await deployer.deploy(Exchange, accounts[1], 10);

    const exchangeToken = await Exchange.deployed()


    // Deploy TokenFarm
    // await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
    // const tokenFarm = await TokenFarm.deployed()

    // Transfer all tokens to TokenFarm (1 million)
    // await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

    // Transfer 100 Mock DAI tokens to investor
    // await daiToken.transfer(accounts[1], '100000000000000000000')
}


// Solution 1 60% good
// module.exports = async function(deployer, network, accounts) {
//
//     var ms = 0;
//     await deployer.deploy(Token);
//     await timeout(ms);
//     await deployer.deploy(Exchange, accounts[1], 10);
//
//     await Token.deployed();
//     await Exchange.deployed();
//     console.log("All should be deployed!");
//     console.log("sleeping for " + ms + " ms");
//     await timeout(ms);
//     console.log("Setup Migration Done!");

    //
    // return deployer.deploy(Token).then(function() {
    //     return deployer.deploy(Exchange, accounts[1], 10, Token.address);
    // });
// };

async function wrappedDeployToken(deployer) {
    return await deployer.deploy(Token);

}

async function wrappedDeployExchange(deployer, network, accounts) {
    return await deployer.deploy(Exchange, accounts[1], 10);
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}


// https://github.com/trufflesuite/truffle/issues/557 bug fix source.


// Solution 1
// var aInstance;
// var bInstance;
// deployer.then(function(){
//     return ContractA.deployed();
// }).then(function(instance){
//     aInstance = instance;
//     return ContractB.deployed();
// }).then(function(instance){
//     bInstance = instance;
// }).then(function(){
//     aInstance.setBAddress(bInstance.address);
//     bInstance.setAAddress(aInstance.address);
//     console.log("Setup Migration Done!");
// });


// Solution 2
//I had the same issue when running truffle test. It was clearly some kind of race condition. I've fixed it by adding await to all deployer.deploy calls in my migration script.
