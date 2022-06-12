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
    address constant ETHER = address(0); // store Ether in tokens mapping with blank address
    event Deposit(address indexed token, address indexed from, uint256 value, uint256 balance);
    // [token][useraddress]
    mapping (address => mapping (address => uint256)) public tokens;

    constructor(address _feeAccount, uint256 _feePercentage) {
        owner = msg.sender;
        feeAccount = _feeAccount;
        feePercentage = _feePercentage;
    }

    function depositEther() payable public  {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender] );
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
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawEther(uint256 _amount) public {

        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);


//        require(tokens[ETHER][msg.sender] > 0, "Insufficient balance");
//        // transfer ether to msg.sender
//        const currentBalance = tokens[ETHER][msg.sender] = 0;
//        tokens[ETHER][msg.sender] = 0;
//        require(Token(ETHER).transferFrom(address(this), msg.sender, currentBalance));
//        emit Deposit(ETHER, msg.sender, tokens[ETHER][msg.sender], 0);
    }

}
