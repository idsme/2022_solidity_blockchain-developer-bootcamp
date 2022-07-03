pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED
// import save match openzepplin library

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/utils/Strings.sol";


contract Token{
    using SafeMath for uint256;

    string public name = "IDSME Token" ;
    string public symbol = "IDSME" ;
    uint public decimals = 18;
    uint public totalSupply;
    address public owner;

    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);


    // add initial supply to whoever deploys contract.
    constructor() {
        totalSupply = 1234567 * (10 ** decimals);
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // All the ERC20 functions probably all do the same... every time...  always. as is part of the spec.
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value , "Insufficient balance custom balance ${_value} ${balances[_from]}");
        return _transfer(msg.sender, _to, _value);
    }

    function _transfer(address _from, address _to, uint256 _value) internal returns (bool success)  {
        //require(_to != address(0), "_to cannot be the zero address 0x0");

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");

        // TODO IDSME lookup reason, why does this have a from parameter... and not uses msg.sender? Just curious eventhough it is in the spec seems unnecssary.

        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value); // Test old - transfer === new allowance level
        _transfer(_from, _to, _value); // let result = ??


        // Reduce allowance by amount of transfer

        return true; // TODO IDSME lookup reason, result true.. as false also leads to success what is true used fo .. if change to false.. cannot find it in return var within test.
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0), "Spender cannot be the zero address 0x0");
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
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

// Bug finding approach!!!
// Bugs encountered and solved.
// Transfer to wrong address or invalid address .. to long to short
// Event talks about wrong address
// Who is allowed to do this bug...
// Should this be an internal or external function.
// Is the order of execution possibly problematic?
// Start at the least obvious file first..
// Focus is always on main func... that gets tested most. So for bug finding we should do opposite.
// Match bugs... divisions by zero.
// But also subtractions lower then zero
// Delete test after writing them for first time... write them again... maybe find some bugs
// Conversion of uint to int or string can go badly
// Should assert / require or revert have be used?
// Do imports have known vulnerabilities? Is it on latest version?
// Are all uints... uint256?
// Are the packages in package.json aligned and up to date. Does one Depend another major version


// Gas reduction... Tips.
// Gas usage is a function of the code and the input data. Less code... , write something that has less lines.. of code but does same.



// TODO IDSME list..
// Read solidity specs... and bugs release notes between versions?
