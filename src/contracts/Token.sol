pragma solidity ^0.5.0;

// import save match openzepplin library
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token{
    using SafeMath for uint256;

    string public name = "IDSME Token" ;
    string public symbol = "IDSME" ;
    uint public decimals = 18;
    uint public totalSupply;
    address public owner;
    mapping (address => uint256) public balances;
    event Transfer(address indexed from, address indexed to, uint256 value);


    // add initial supply to whoever deploys contract.
    constructor() public {
        totalSupply = 1234567 * (10 ** decimals);
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // All the ERC20 functions proably all do the same... every time...  always. as is part of the spec.
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_value <= balances[msg.sender], "Insufficient balance custom");
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //return balance of address
    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // modifier that checks if balance is greater the account balance
    modifier greaterThanBalance {
        uint balance = balances[msg.sender];
        require(balance > msg.value);
        _;
    }

}
