import {EVM_REVERT, add, convertToWei} from "./convertHelpersEs6.js";
import convert from "lodash/fp/convert";

const Token = artifacts.require("./Exchange");
const Contract = artifacts.require("./Exchange");
require("chai").use(require("chai-as-promised")).should();

// TODO IDSME... openzepplin writes contract implementations... are there also standard test available... for ERC20 that have been implemented? As their counterpart?
// As they are always the same
contract("Exchange", accounts => {
    const owner = accounts[0];
    const feeAccount = accounts[1];
    const user1 = accounts[2];
    const feePercentage = 10;
    const amount = convertToWei(10);
    let contract;
    let token;

    beforeEach(async function() {
        contract = await Contract.new(feeAccount, feePercentage);
        token = await Token.new();
        await token.transfer(contract.address, amount, {from: owner});
    })

    describe("deployment", () => {
        it("should get contract.owner", async () => {
            const value = await contract.owner;
            value.to.should.equal(owner);
        });

        xit("should get contract.feeAccount", async () => {
            const value = await contract.freeAccount();
            value.should.equal(freeAccount);
        });

        xit("should get contract.feeAccount", async () => {
            const value = await contract.feePercentage();
            value.toString().should.equal("10");
        });
    });

    xdescribe("Depositing tokens into exchange", () => {
        let result;


        beforeEach(async function() {
            await token.approve(contract.address, amount, {from: user1});
            result = contract.deposit(token.address, amount, {from: user1});
        })

        describe("Deposit tokens happy scenarios", () => {

            it('should tracks the token deposit', async() => {
                const balance = await token.balanceOf(contract.address);
                balance.toString().should.equal(convertToWei(10).toString());
                // original account should decrease by 10.
                // balance of user1 should increase by 10 on exchange
            });

        });

        describe("Deposit tokens unhappy scenarios", () => {

        });
    });


});
