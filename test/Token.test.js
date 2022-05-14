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
});
