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

    using SafeMath for uint256;


    address public owner;
    address public feeAccount;
    uint256 public feePercentage;
    event Transfer(address indexed from, address indexed to, uint256 value);
    // [token][useraddress]
    mapping (address => mapping (address => uint256)) public tokens;

    constructor(address _feeAccount, uint256 _feePercentage) {
        owner = msg.sender;
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
    }

    function depositToken(address _token, uint256 _amount) public payable {
        // DONE Which _token
        // DONE How much _amount
        // DONE Send token to this contract
        // Manage depositToken
        // DONE Emit event
        require(Token(_token).transferFrom(msg.sender, address(this), _amount)); // exchange move tokens to itself
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount; // IDSME BUG should use safeMath here but import does not work during compile time. Something is not configured right for this contract.

        // require(_amount > 0, "Amount must be greater than 0");
        //   require(msg.value == 0, "Deposit Ether not supported");

        // Create instance of this token that is on blockchain
        // The msg.sender===from wants to deposit
        // address(this)=== this contract === to wants to receive the tokens.
        emit Transfer(msg.sender, address(this), _amount);
    }

}
