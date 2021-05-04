// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;

import "./StoreETH.sol";
import "./Random.sol";


contract Game is RandomNumberGenerate, StoreETH {
    uint8 public whoWin = 0;  //if 0 = not start  if 1 = user win if 2 AI win 3 is no winner
    uint256 private userSelect = 10;
    uint256 private amount = 0;

    function startGame(uint256 selection) public payable {
        //0 is rock
        //1 is paper
        //2 is scissors
        require(selection <= 2 , "The amount must be less than 2");
        whoWin = 0;
        amount = 0;
        userSelect = 10;

        require(msg.value > 0 , "The amount must be larger than 0");
        amount = msg.value;

        deposit(); // trnasfer money to pool
        userSelect = selection;
        getRandomNumber();
    }

    function CheckWinner() public  {
        require(randomResult > 0, "Need to wait Random Number");

        uint256 randomNumber = (randomResult % 3);


        if (randomNumber == userSelect) { // same number
            whoWin = 3;
        }
        else if (randomNumber-1 == userSelect || randomNumber == 0 && userSelect == 2) {
            whoWin = 2;
        }
        else if (randomNumber+1 == userSelect || randomNumber == 2 && userSelect == 0) {
            withdraw(amount*2);
            whoWin = 1;
        }
        randomResult = 0; //reset the random number
    }
}
