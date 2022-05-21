pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED

import "./Token.sol";
// Deposit & Withdraw Funds
// Manage Order - Make or Cancel
// Handle Trades - Charge fees

// TODO:
// [x] Set the fee account
// [] Deposit Ether
// [] Withdraw Ether
// [] Deposit Tokens
// [] Withdraw Tokens
// [] Check balances
// [] Make  Order
// [] Cancel Order
// [] Fill Order
// [] Charge fees

// import save match openzepplin library
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Exchange {

    address public owner;
    address public feeAccount;
    uint256 public feePercentage;
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(address _feeAccount, uint256 _feePercentage) {
        owner = msg.sender;
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
    }

    function depositToken(address _token, uint256 _amount) public payable {
        // Which _token
        // How much _amount
        //Send token to this contract
        // Manage depositToken
        // Emit event

//        require(_amount > 0, "Amount must be greater than 0");
//        require(msg.value == 0, "Deposit Ether not supported");

        Token(_token).transferFrom(msg.sender, address(this), _amount);
        emit Transfer(msg.sender, address(this), _amount);


    }

}
