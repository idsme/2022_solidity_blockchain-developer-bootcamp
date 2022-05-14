const Token = artifacts.require("./Token");
require("chai").use(require("chai-as-promised")).should();

contract("Token", accounts => {
    const owner = accounts[0];
    const user1 = accounts[1];
    let token

    beforeEach(async function() {
        token = await Token.new();
    })

    describe("deployment", () => {
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
    describe("balanceOf", () => {
        it("should return the balance of the user1 account", async () => {
            const balance = await token.balanceOf(user1);
            balance.toString().should.equal('0');
        });

        it("should return the balance of the ower account", async () => {
            const balance = await token.balanceOf(owner);
            balance.toString().should.equal('1234567000000000000000000');
        });
    });

    describe("transfer", () => {

        it("should transfer 100 tokens to user1", async () => {

            let ownerBalance = await token.balanceOf(owner); // expect some big number
            console.log(ownerBalance.toString());
            let receiverBalance = await token.balanceOf(user1); // expect = 0

            const success = await token.transfer(user1, 100, { from: owner });


            // get owner balance
            let newOwnerBalance = await token.balanceOf(owner);
            console.log(newOwnerBalance.toString());

            let newReceiverBalance = await token.balanceOf(user1); // expect = 100

            // debugging
            // console.log(receiverBalance.toString());
            // console.log(newReceiverBalance.toString());

            // expect new balance to equal original balance for owner minus 100
            newReceiverBalance.toString().should.equal((100).toString());
            // TODO IDSME works but want below to work as well
            //newOwnerBalance.toString().should.equal((ownerBalance - 100).toString());

        });

        // it("should not transfer token to user1", async () => {
        //     await token.transfer(user1, 100).should.be.rejectedWith("revert");
        // });
    });

});
