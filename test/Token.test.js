import {EVM_REVERT, add, convertToWei} from "./convertHelpersEs6.js";

const Token = artifacts.require("./Token");
require("chai").use(require("chai-as-promised")).should();

// TODO IDSME... openzepplin writes contract implementations... are there also standard test available... for ERC20 that have been implemented? As their counterpart?
// As they are always the same
contract("Token", accounts => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const exchange = accounts[2];
    let token;

    beforeEach(async function() {
        token = await Token.new();
    })

    xdescribe("deployment", () => {
        it("should get token name", async () => {
            const name = await token.name();
            assert.equal(name, "IDSME Token");
            name.should.equal('IDSME Token');
            expect(name).to.equal('IDSME Token');
        });

        it("should get symbol", async () => {
            const value = await token.symbol();
            value.should.equal('IDSME');
        });

        it("should get decimals", async () => {
            const value = await token.decimals();
            value.toString().should.equal('18');
        });

        it("should get totalSupply", async () => {
            const value = await token.totalSupply();
            value.toString().should.equal('1234567000000000000000000');
        });
    });

    // get balance of address
    // TODO IDSME but if these test run out of order this will fail.
    xdescribe("balanceOf", () => {
        it("should return the balance of the user1 account", async () => {
            const balance = await token.balanceOf(user1);
            balance.toString().should.equal('0');
        });

        it("should return the balance of the ower account", async () => {
            const balance = await token.balanceOf(owner);
            balance.toString().should.equal('1234567000000000000000000');
        });
    });

    xdescribe("transfer happy", () => {

        it("should transfer 100 tokens to user1", async () => {

            // setup
            let ownerBalance = await token.balanceOf(owner); // expect some big number
            let receiverBalance = await token.balanceOf(user1); // expect = 0

            // action
            const success = await token.transfer(user1, convertToWei(100), { from: owner });

            // assertions
            let newOwnerBalance = await token.balanceOf(owner);
            let newReceiverBalance = await token.balanceOf(user1); // expect = 100

            newReceiverBalance.toString().should.equal(convertToWei(100).toString());

            const result = add(newOwnerBalance, newReceiverBalance);
            ownerBalance.toString().should.equal(result.toString());
        });

        // test should check for transfer event
        it("should emit a transfer event", async () => {
            //action
            const { logs } = await token.transfer(user1, convertToWei(100), { from: owner });

            //assert v1
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, "Transfer");
            assert.equal(logs[0].args.from, owner);
            assert.equal(logs[0].args.to, user1);
            assert.equal(logs[0].args.value.toString(), convertToWei(100).toString());

            // assert v2
            logs[0].event.should.equal("Transfer");
            logs[0].args.from.should.equal(owner);
            logs[0].args.to.should.equal(user1);
            logs[0].args.value.toString().should.equal(convertToWei(100).toString());

            // assert v3
            expect(logs[0].event).to.equal("Transfer");
            expect(logs[0].args.from).to.equal(owner);
            expect(logs[0].args.to).to.equal(user1);
            expect(logs[0].args.value.toString()).to.equal(convertToWei(100).toString());
        });

    });

    xdescribe("ERC20 if transfer unhappy scenarios", () => {
        it("should throw according to spec", async () => {
            const amountIsMoreThenTotalSupply = convertToWei(1000000000000);
            const result = await token.transfer(user1, amountIsMoreThenTotalSupply, { from: owner }).should.be.rejectedWith(EVM_REVERT);
        })

        it("should throw according to spec, when origin's account balance is to low", async () => {
            const amountIsMoreThenTotalSupply = convertToWei(1000000000000);
            const result = await token.transfer(owner , amountIsMoreThenTotalSupply, { from: owner }).should.be.rejectedWith(EVM_REVERT);
        })

        // Address must be valid?? but what if it is hexadecimals? But not of correct length? Solidity is smart enough to throw it by itself...
        it('should reject invalid recipient to short', async () => {
            const invalidRecipient = 0x0;
            const result = await token.transfer(invalidRecipient, 100, { from: owner }).should.be.rejectedWith('invalid address (arg="_to", coderType="address", value=0)');
        });

        it('should reject invalid recipient address to long', async () => {
            const invalidRecipient = 0x03489734758473589743895745789234578934758743859734287583457;
            const result = await token.transfer(invalidRecipient, 100, { from: owner }).should.be.rejectedWith('invalid address (arg="_to", coderType="address", value=1.4163924335531808e+69');
        });

        it('should reject invalid recipient address garbage', async () => {
            const invalidRecipient = "0x01zyz";
            const result = await token.transfer(invalidRecipient, 100, { from: owner }).should.be.rejectedWith('invalid address (arg="_to", coderType="address", value="0x01zyz"');
        });

        it('should reject as from is blank', async () => {
            const result = await token.transfer(user1, 100, { from: '0x0' }).should.be.rejectedWith('Provided address "0x0" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can\'t be converted.');
        });
    })

    describe("Approve ERC20 on behalf of owner x limit to transfer", () => {
        let result;
        let amount;

        beforeEach(async () => {
           amount = convertToWei(100);
           result = await token.approve(exchange, amount, { from: owner });
        });

        describe("success allocated an allowance for delegated token spending", () => {

            it('should have a 100 tokens as allowance', async () => {
                const allowance = await token.allowance(owner, exchange);
                allowance.toString().should.equal(convertToWei(100).toString());

                result.logs[0].event.should.equal("Approval");
                console.log(result.logs[0].args);
                result.logs[0].args.owner.should.equal(owner, "owner is not the same");
                result.logs[0].args.spender.should.equal(exchange, "spender is not the same");
                result.logs[0].args.value.toString().should.equal(convertToWei(100).toString(), "allowance amount is not a 100 tokens");
            });
        });
    });

});
