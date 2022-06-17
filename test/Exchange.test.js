import {EVM_REVERT, add, convertToWei, ETHER_ADDRESS} from "./convertHelpersEs6.js";

//const { artifacts } = require("truffle"); // Crashes stuff.
// import { artifacts } from "truffle"; not working
const Token = artifacts.require("./Token");
const Contract = artifacts.require("./Exchange");
require("chai").use(require("chai-as-promised")).should();

// TODO IDSME... openzepplin writes contract implementations... are there also standard test available... for ERC20 that have been implemented? As their counterpart?
// As they are always the same
contract("Exchange", accounts => {
    const owner = accounts[0];
    const user1 = accounts[2];
    const feeAccount = accounts[3];
    const user2 = accounts[4];
    const feePercentage = 10;
    const amount = convertToWei(1);
    const amount_larger_then_balance = convertToWei(1234567890);
    let contract;
    let token;

    beforeEach(async () =>{
        contract = await Contract.new(feeAccount, feePercentage);
        token = await Token.new();
    })

   describe("deployment", () => {
        it("should get contract.feeAccount", async () => {
            const value = await contract.feeAccount();
            value.should.equal(feeAccount);
        });

        it("should get contract.feePercentage", async () => {
            const value = await contract.feePercentage();
            value.toString().should.equal("10");
        });

        it("should get contract.owner", async () => {
            const value = await contract.owner();
            value.should.equal(owner);
        });
    });

    xdescribe("Deposit Ether", () => {

        let result;

        beforeEach(async () => {
            result = await contract.depositEther({from: user2, value: amount});
        });

        it('deposit Ether', async () => {
            const balanceUser2Exchange = await contract.tokens(ETHER_ADDRESS, user2);
            console.log("exchange.balanceUser2: " + balanceUser2Exchange);
            balanceUser2Exchange.toString().should.equal(amount.toString());
        });

        it('should emit a Deposit Event', async () => {
            const log = result.logs[0];
            //console.log("log: " + log);
            log.event.should.eq('Deposit');
            const event = log.args;
            console.log('Deposit Event', event);
            event.token.should.equal(ETHER_ADDRESS, "token address not equal to ETHER_ADDRESS");
            event.from.should.equal(user2, "user2 address not equal");
            event.value.toString().should.equal(amount.toString(), "msg.value not equal amount");
            event.balance.toString().should.equal(amount.toString(), "balance not equal amount");
        });

    });

    xdescribe("Withdraw Ether", () => {

        let result;
        beforeEach(async () => {
            result = await contract.depositEther({from: user2, value: amount});
            // TODO IDSME Above If user1 it does not work.. Don't know why find out later. Probably something to do with decreasing balance. Of the different tests.
        });

        describe("success", () => {
            beforeEach(async () => {
                result = await contract.withdrawEther(amount, {from: user2});
            });

            it('with withdraw Ether', async () => {
                const balanceUser2Exchange = await contract.tokens(ETHER_ADDRESS, user2);
                console.log("exchange.balanceUser2: " + balanceUser2Exchange);
                balanceUser2Exchange.toString().should.equal('0');
            });

            it('should emit a WithDraw Event', async () => { //to implement
                const log = result.logs[0];
                //console.log("log: " + log);
                log.event.should.eq('Withdraw');
                const event = log.args;
                // console.log('Withdraw Event', event);
                event.token.should.equal(ETHER_ADDRESS, "token address not equal to ETHER_ADDRESS");
                event.from.should.equal(user2, "user2 address not equal");
                event.value.toString().should.equal(amount.toString(), "msg.value not equal amount");
                event.balance.toString().should.equal('0', "balance not equal amount");
            });
        });

        describe("failure", () => {
            let balanceUser2Exchange = null;
            beforeEach(async () => {
                balanceUser2Exchange = await contract.tokens(ETHER_ADDRESS, user2);
            });

            it('should rejects withdraws for insufficient balances', async () => {
                // withdraw to much
                result = await contract.withdrawEther(balanceUser2Exchange + 1, {from: user2}).should.be.rejectedWith(EVM_REVERT);
            });


        });

    });

    describe("Depositing tokens into exchange", () => {
        let result;

        beforeEach(async function() {
            await token.transfer(user1, amount, {from: owner});
            let balanceOfUser1 = await token.balanceOf(user1);
            balanceOfUser1.toString().should.equal(amount.toString());
            //console.log("exchange: " + blanceOfUser1);

            //await token.approve(exchange, amount, { from: owner });
            await token.approve(contract.address, amount, {from: user1}); // checked.
            const allowance = await token.allowance(user1, contract.address);
            allowance.toString().should.equal(amount.toString());

            console.log("token address: " + token.address);
            result = await contract.depositToken(token.address, amount, {from: user1});
        })

        xdescribe("Success", () => {

            it('should tracks the token deposit', async() => {
                console.log("starting test");
                const exchangeBalance = await token.balanceOf(contract.address);
                // balance of exchange on token should increase by 10
                console.log("token.exchangeBalance should be 10===" + exchangeBalance.toString());
                exchangeBalance.toString().should.equal(amount.toString());

                // original account should decrease by 10.
                const balanceOwner = await token.balanceOf(owner);
                console.log("token.balanceOwner should be decreased to: 1234557===" + balanceOwner.toString());
                balanceOwner.toString().should.equal(convertToWei(1234566).toString());

                console.log("token.address.it: " + token.address);
                const balanceUser1Exchange = await contract.tokens(token.address, user1);
                console.log("exchange.balanceUser1: " + balanceUser1Exchange);
                balanceUser1Exchange.toString().should.equal(amount.toString());
            });

            it('should emit a Deposit Event', async () => {
                const log = result.logs[0];
                log.event.should.eq('Deposit');
                const event = log.args;
//                console.log('Deposit Event', event);
                event.token.should.equal(token.address);
                event.from.should.equal(user1);
                console.log('event.value:', event.value);
                console.log('event.balance:', event.balance);
                event.value.toString().should.equal(amount.toString());
                event.balance.toString().should.equal(amount.toString());
            });
        });

        xdescribe("Failure", () => {
            it('not enough allowance', function () {
                return contract.depositToken(token.address, amount_larger_then_balance, {from: user1})
                    .should.be.rejectedWith("VM Exception while processing transaction: revert Insufficient balance -- Reason given: Insufficient balance.");
            });
        });


        describe("Withdraw Token", () => {

            let result;
            beforeEach(async () => {
                // TODO IDSME Above If user1 it does not work.. Don't know why find out later. Probably something to do with decreasing balance. Of the different tests.
            });

            describe("success", () => {
                beforeEach(async () => {
                    result = await contract.withdrawTokens(token.address, amount, {from: user1});
                });

                it('with withdraw Tokens', async () => {
                    const balanceUser1Exchange = await contract.tokens(ETHER_ADDRESS, user1);
                    console.log("exchange.balanceUser1: " + balanceUser1Exchange);
                    balanceUser1Exchange.toString().should.equal('0');
                });

                it('should emit a WithDraw Event', async () => { //to implement
                    const log = result.logs[0];
                    //console.log("log: " + log);
                    log.event.should.eq('Withdraw');
                    const event = log.args;
                    // console.log('Withdraw Event', event);
                    event.token.should.equal(token.address, "token address not equal to TOKEN_ADDRESS");
                    event.from.should.equal(user1, "user1 address not equal");
                    event.value.toString().should.equal(amount.toString(), "msg.value not equal amount");
                    event.balance.toString().should.equal('0', "balance not equal amount");
                });
            });

            describe("failure", () => {
                let balanceUser1Exchange = null;
                beforeEach(async () => {
                    balanceUser1Exchange = await contract.tokens(token.address, user1);
                });

                it('should rejects withdraws for insufficient balances', async () => {
                    // withdraw to much
                    result = await contract.withdrawTokens(token.address, balanceUser1Exchange + 1, {from: user1}).should.be.rejectedWith(EVM_REVERT);
                });


            });

        });

    });


});


