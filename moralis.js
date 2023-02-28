import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Web3 from "web3";
import DataRW from "../abis/DataRW.json";
const Moralis = require("moralis").default;

const App = () => {
  const [state, setState] = useState({
    getData: null,
    dataHash: null,
    dataLen: 0,
    metamaskAC: "",
    contract: null,
    dataSetFlag: false,
  });

  let tempArray = [];
  let uploadArray = [
    {
      path: "myJson.json",
      content: ["helloData"],
    },
  ];

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  // Get the account
  // Get the network
  // Get smart contract
  // Get dataHash

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const networkData = await DataRW.networks[networkId];
    setState({ metamaskAC: accounts[0] });

    if (networkData) {
      const abi = DataRW.abi;
      const address = networkData.address;
      // fetching the smart contract
      const contract = new web3.eth.Contract(abi, address);
      setState({ contract });

      if (state.dataSetFlag) {
        console.log("dataset flagh:>", state.dataHash);
        const newDataHash = await contract.methods.get().call();
        setState({
          getData: newDataHash,
        });
        console.log("new data hash:::", newDataHash);
      }
    } else {
      window.alert("Smart contract not detected yet!");
    }
  };

  // connect to web3
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.eth;
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please use metamask matchaa!");
    }
  };

  // moralis and ipfs
  const sendToIpfs = async () => {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey:
          // "GFJ8vWRvbbJKjk3ajmfHDeVyNqF0JXw48TzB0QcyTL4YT1Mi4jwfo8FvRXdIa6XP",
          "p1KL1YbNWDDp5dwj3Fe0Bj2faF24D6TzohCpXDs4VwjuhiI50CZj6sg9dza8ABh9",
      });
    }

    console.log("abi:::", uploadArray);
    if (uploadArray[0].content.length === state.dataLen + 10) {
      console.log("data length:>", state.dataLen);
      const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: uploadArray,
      });

      setState({ dataHash: response.result[0].path });
    }
  };

  const socket = socketIOClient("http://127.0.0.1:4001/");
  socket.on("message", (data) => {
    tempArray.push(data);

    if (
      tempArray.length % 10 === 0 &&
      tempArray.length === state.dataLen + 10
    ) {
      uploadArray[0].content = tempArray;
      console.log(uploadArray[0].content);
      sendToIpfs();
      console.log("first down here");

      if (state.dataHash !== null) {
        state.contract.methods
          .set(state.dataHash)
          .send({ from: state.metamaskAC })
          .then(() => {
            setState({ dataSetFlag: true });
          });
      }

      console.log("first down here 2");

      state.dataLen = tempArray.length;
    }
  });

  return <div>{state.dataHash}</div>;
};

export default App;

// setState({
//   dataHash: response.result[0].path,
//   // .split("https://ipfs.moralis.io:2053/ipfs/")
//   // .pop()
//   // .split("/myJson.json")[0],
// });
