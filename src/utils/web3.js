
import Web3 from 'web3'
import NodeInfo from './const'
const { ethereum } = window;
let url = NodeInfo.url;
let contractJson = require('../contract/Game.json');
let contractAddress = NodeInfo.contractAddress;


export function initMetaMask(){

    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            ethereum.enable();
        } catch (error) {
            console.log("User denied account access...")
        }
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

export async function whoWin(){
    let output = '';
    try {
        let web3 = new Web3(url);
        var tokenContract = new web3.eth.Contract(contractJson.abi, contractAddress);
        output = await tokenContract.methods.whoWin().call();
    } catch (err) {
        console.log('#### get Who Win err: ', err);
    }
    return output
}

export async function getRandomResult() {
    let output = '';
    try {
        let web3 = new Web3(url);
        var tokenContract = new web3.eth.Contract(contractJson.abi, contractAddress);
        output = await tokenContract.methods.randomResult().call();
    } catch (err) {
        console.log('#### get Result err: ', err);
    }

    return output


}

export async function playGame(select,amount){
    let output = '';
    console.log("Selected : ", select);
    let web3 = new Web3(url);
    // let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    try {
        var tokenContract = new web3.eth.Contract(contractJson.abi, contractAddress);
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        let requestParams = {
            from: account,
            to: "0x75FE2EB72A9a10FA592ab295b719af3A824c4062",
            data: "0xe5ed1d590000000000000000000000000000000000000000000000000000000000000002",
            value: web3.utils.toWei((amount).toString(), "gwei"),
            gasLimit: web3.utils.toHex(300000),
            gasPrice: web3.utils.toHex(1000000000),
            gas: "",//gas limit
        }
        const gas = await tokenContract.methods.startGame(select).estimateGas(requestParams);

        requestParams.gas = gas.toString()

        output = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [requestParams],
            });
    } catch (err) {
        return err
    }
    return output

}


export async function checkWinner(){
    let output = '';
    let web3 = new Web3(url);

    try {
        var tokenContract = new web3.eth.Contract(contractJson.abi, contractAddress);
        const accounts = await window.ethereum.enable();
        const account = accounts[0];

        let requestParams = {
            from: account,
            to: "0x75FE2EB72A9a10FA592ab295b719af3A824c4062",
            data : "0xa2f3d16e",
            gasLimit: web3.utils.toHex(300000),
            gasPrice: web3.utils.toHex(1000000000),
            gas: "",//gas limit
        }
        const gas = await tokenContract.methods.CheckWinner().estimateGas(requestParams);

        requestParams.gas = gas.toString()
        output = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [requestParams],
            });
    } catch (err) {
        return err
    }
    return output
}
