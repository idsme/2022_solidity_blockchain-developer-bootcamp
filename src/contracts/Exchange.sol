pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED

import "./Token.sol";
// Deposit & Withdraw Funds
// Manage Order - Make or Cancel
// Handle Trades - Charge fees

// TODO:
// [x] Set the fee account
// [X] Deposit Ether
// [X] Withdraw Ether
// [X] Deposit Tokens
// [X] Withdraw Tokens
// [X] Check balances
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
    event Withdraw(address indexed token, address indexed from, uint256 value, uint256 balance);
    event CreatedOrder(uint id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);

    // [token][useraddress]
    mapping (address => mapping (address => uint256)) public tokens;

    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    mapping (uint256 =>_Order) public orders;

    // A way to model the order
    // store the order.
    // Add order to storage and retrieve

    uint256 public orderCount;


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

    function withdrawEther(uint256 _amount) public payable {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function withdrawTokens(address _token, uint256 _amount) public payable {
        require(_token != address(0));
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer(msg.sender, _amount)); // exchange move tokens to itself

        // why not this payable(msg.sender).transfer(_amount);
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        // test if has enough of _token Give.@author
        // require(tokens[_token][msg.sender] >= _amount);

        // Fill order ?? Should this be some where else?
        // Only if price is possible.. as this is a limit order fill the order???
        // Some where we need to get the price from and check it against the order... to validate over time if order filling is possible.
        // tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].sub(_amount); // reduce amount tokenGive
        // tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amount); // add amount tokenGet

        orderCount = orderCount.add(1);
        orders[orderCount] =  _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
        emit CreatedOrder(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }
}
