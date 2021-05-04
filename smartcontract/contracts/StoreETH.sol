// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;
contract StoreETH{

    address owner;
    mapping(address => uint256) balances;

    constructor() payable public {
        owner = address(this);
    }

    function deposit()  public payable {
        balances[owner] += msg.value;  //Update Balance
    }

    function withdraw(uint amount) internal {
        if (balances[owner] <= amount) {  //IF the pool not enough money, give back all of eth
            amount = balances[owner];
            balances[owner] = 0;

        }else {
            balances[owner] -= amount;
        }

        msg.sender.transfer(amount);
    }


}