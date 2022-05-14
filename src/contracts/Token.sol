pragma solidity ^0.5.0;

contract Token{
    string public name = "IDSME Token" ;
    string public symbol = "IDSME" ;
    uint public decimals = 18;
    uint public totalSupply;
    address public owner;

    constructor() public {
        totalSupply = 1234567 * (10 ** decimals);
        owner = msg.sender;
    }
}
