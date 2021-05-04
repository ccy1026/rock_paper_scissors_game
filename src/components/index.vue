<template>

  <div class="mainPage">
      <div class="start_game">Rock Paper Scissors Game</div>
    <br>
    <p>Pool Balance: {{this.balance}} ETH</p>
    <label>Please input the amount <input id="betAmount" type="number" v-model="betAmount"> Gwei</label>
      <div class="group" v-if="stage == 0">
        <div id="rock" @click="gameStart(0)">Rock</div>
        <div id="paper" @click="gameStart(1)">Paper</div>
        <div id="scissors" @click="gameStart(2)">Scissors</div>
      </div>
    <br>
    <br>
    <br>
    <label v-if="stage != 0">Status Bar</label>
    <div class="progress" v-if="stage != 0">
      <div class="bar" :style="btnStyles"></div>

      <p>{{detail}}</p>
    </div>

    <div class="endOfResult" v-if="winner >=1 && winner <=3">
      <p v-if="winner == 3">No winner.</p>
      <p v-if="winner == 2">You Lose.</p>
      <p v-if="winner == 1">You Win.</p>
      <p @click="restart">Restart</p>
    </div>

  </div>
</template>

<script>

var ethers = require('ethers');
import NodeInfo from '../utils/const'
import {initMetaMask, playGame, whoWin,getRandomResult, checkWinner} from '../utils/web3';
export default {
  name: 'main',
  data : function() {
    return {
          gameStarted : false,
          metamaskLoaded : false,
          getData : {
            metaMaskAddress : "",
            type : ""
          },
          balance : 0,
          betAmount : 10,
          stepsDone : 0,
          totalSteps : 100,
          detail : "",
          winner : 0,
          stage: 0,   //0 is wait to start // 1 is started game // 2 is wait random num // 3 is start check winner // 4 is get winner

      };
  },
  computed: {
    btnStyles() {
      return {
         width : `${this.stepsDone / this.totalSteps * 100}%`,
          height: `20px`
      };
    }
  },
  methods : {
    getBalance : async function() {
      var provider = ethers.providers.getDefaultProvider('rinkeby')
      await provider.getBalance(NodeInfo.contractAddress).then(res => this.balance = ethers.BigNumber.from(res._hex) / 1000000000000000000)
    },
    gameStart : async function(select) {
      this.stage = 0
      this.winner = null
      let err = await playGame(select, this.betAmount);
      if  ((err["code"] == 4001) || (String(err).includes("revert") || (String(err).includes("Need to wait Random Number")))) {
          this.gameStart(select)
          return false
        }
        this.stage += 1
        this.stepsDone = 30
        this.detail = "Sending the request and wait for blocks confirm"

    },
    getRandom : async function() {
      this.getBalance()
      this.stage = 2
      this.stepsDone = 50

    },
    checkWin : async function() {
      var that = this
      let err = await checkWinner()
      if ((err["code"] == 4001) || (String(err).includes("revert"))){
        window.setTimeout(
            function() {
              that.checkWin()
            }, 5000);

        return false
      } else{
        this.detail = "Send a request to check Winner"
        let s4 =  new Promise((resolve) => {
          window.setTimeout(
              function() {
                console.log("Stage 3")
                that.detail = "Wait for response"
                resolve();
              }, 5000);
        });
        s4.then().catch((res) => {
          console.log('Handle rejected promise ('+res+') here.');
        });
        this.stage = 3
        this.stepsDone = 80
      }

    },
    showResult : async function() {
      var that = this
      console.log("Stage 4")
      this.stepsDone = 90
      let result = await whoWin()
      console.log("Result is : ", result)
      if (result == 0) {
        window.setTimeout(
            function() {
              that.showResult()
            }, 5000);
          return false
      }
      this.stage = 4
      this.stepsDone = 100
      this.getBalance()
      this.detail = "Done"
      this.winner = parseInt(result)

    },
    restart : function() {
      this.stage = 0
    }




    },
  mounted: function () {
    initMetaMask();
    this.getBalance()

  },
  watch : {
    stage : async function () {
      var that = this;
        if(this.stage == 1) {
          let s2 =  new Promise((resolve) => {
                console.log("Stage 1")
                window.setTimeout(
                    function() {
                      console.log(this)
                      that.getRandom()
                      resolve();
                    }, 20000);
          });
          s2.then().catch((res) => {
              console.log('Handle rejected promise ('+res+') here.');
          });
        }
        if(this.stage == 2) {
            console.log("Stage 2")
            getRandomResult()
            this.stepsDone = 50
            this.checkWin()

        }
        if (this.stage == 3) {
          let s5 =  new Promise((resolve) => {
            console.log("Stage 3")
            this.detail = "Send a request to check Winner"
            this.stage = 80
            window.setTimeout(
                function() {
                  that.showResult()
                  resolve();
                }, 5000);
          });
          s5.then().catch((res) => {
            console.log('Handle rejected promise ('+res+') here.');
          });
        }
    }
  }
}

</script>


<style scoped >
a {
  cursor: pointer;
}
.start_game {
  font-size: 2rem;
}
#metamask__link {
  color: #2c3e50;
  font-weight: bold;

}
.group {
  display: flex;
  justify-content: center;
  max-width: 1400px;
  padding: 0 20px;
  gap: 30px;
}
.group > div {
  flex: 1 0 calc(33% - 30px);
  display: flex;
  justify-content: center;
  padding: 4rem 0;
  margin-top: 2rem;
  background: #f6f6f6;
  border: 1px solid;
  border-radius: 20px;
  cursor: pointer;
}
.progress {
  width: 100%;
  height: 20px;
  background: #42b983;
  border-radius: 20px;
  margin-bottom: 40px;
}
.bar {
  border-radius: 20px;
  background:#2c3e50;

}
</style>
