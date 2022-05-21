exports.convertToWei = (amount) => {
    return new web3.utils.BN(web3.utils.toWei(amount.toString(), "ether"));
}

exports.add = (A, B) => {
    const AL = A.toString().length
    const BL = B.toString().length
    const ML = Math.max(AL, BL)

    let carry = 0, sum = ''

    for (let i = 1; i <= ML; i++) {
        let a = +A.toString().charAt(AL - i)
        let b = +B.toString().charAt(BL - i)

        let t = carry + a + b
        carry = t/10 |0
        t %= 10

        sum = (i === ML && carry)
            ? carry*10 + t + sum
            : t + sum
    }

    return sum
}


exports.EVM_REVERT = "VM Exception while processing transaction: revert";

exports.EVM_REJECTED_INVALID_ADDRESS = "invalid address (arg=\"_to\", coderType=\"address\", value=0)";
