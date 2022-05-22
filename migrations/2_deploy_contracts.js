const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

// Working 15% of the time correctly timing issue.
// module.exports = function(deployer, network, accounts) {
//     return deployer.deploy(Token).then(function() {
//         return deployer.deploy(Exchange, accounts[1], 10, Token.address);
//     });
// };

// Solution 1 60% good
module.exports = function(deployer, network, accounts) {

    deployer.deploy(Token).then(function() {
        return deployer.deploy(Exchange, accounts[1], 10);
    });

    var aInstance;
    var bInstance;
    deployer.then(function(){
        return Token.deployed();
    }).then(function(instance){
        aInstance = instance;
        return Exchange.deployed();
    }).then(function(instance){
        bInstance = instance;
    }).then(function(){
        var ms = 1000;
        console.log("sleeping for " + ms + " ms");
        timeout(ms);
        console.log("Setup Migration Done!");
    });

    //
    // return deployer.deploy(Token).then(function() {
    //     return deployer.deploy(Exchange, accounts[1], 10, Token.address);
    // });
};

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
