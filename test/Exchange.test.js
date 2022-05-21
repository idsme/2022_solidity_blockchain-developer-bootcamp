import {EVM_REVERT, add, convertToWei} from "./convertHelpersEs6.js";


const Token = artifacts.require("./Token");
const Contract = artifacts.require("./Exchange");
require("chai").use(require("chai-as-promised")).should();

// TODO IDSME... openzepplin writes contract implementations... are there also standard test available... for ERC20 that have been implemented? As their counterpart?
// As they are always the same
contract("Exchange", accounts => {
    const owner = accounts[0];
    const user1 = accounts[2];
    const feeAccount = accounts[3];
    const feePercentage = 10;
    const amount = convertToWei(10);
    let contract;
    let token;

    beforeEach(async function() {
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
            result = contract.depositToken(token.address, amount, {from: user1});
        })

        describe("Success", () => {

            it('should tracks the token deposit', async() => {
                const exchangeBalance = await token.balanceOf(contract.address);
                // balance of exchange on token should increase by 10
                console.log("token.exchangeBalance: " + exchangeBalance.toString());
                exchangeBalance.toString().should.equal(amount.toString());

                // original account should decrease by 10.
                // const balanceOwner = await token.balanceOf(owner);
                // balanceOwner.toString().should.equal(convertToWei(1234557).toString();


                console.log("token.address.it: " + token.address);
                // const balanceUser1Exchange = await contract.tokens(token.address, user1);
                // console.log("exchange.balanceUser1: " + balanceUser1Exchange);
                // balanceUser1Exchange.toString().should.equal(amount.toString());
            });
        });

        describe("Failure", () => {
            it('not enough allowance', function () {

            });
        });
    });
});
