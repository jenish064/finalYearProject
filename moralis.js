import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Web3 from "web3";
import DataRW from "../abis/DataRW.json";
const Moralis = require("moralis").default;

const App = () => {
  const [state, setState] = useState({
    getData: null,
    dataHash: "",
    dataLen: 0,
    dataSetFlag: false,
  });

  let nakedDataHash = null;
  let metamaskAC = null;
  let globalContract = null;

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

  const getMethodContract = async () => {
    if (globalContract !== null) {
      const newDataHash = await globalContract.methods.get().call();
      await fetch(newDataHash).then((result) => {
        console.log("result result result:::", result);
        setState({ getData: result.json() });
      });
      console.log("new data hash:::", state.getData);
    }
  };

  // useUpdateEffect(() => {
  //   getMethodContract();
  // }, [state.dataSetFlag]);

  // Get the account
  // Get the network
  // Get smart contract
  // Get dataHash

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const networkData = await DataRW.networks[networkId];
    metamaskAC = accounts[0];

    if (networkData) {
      const abi = DataRW.abi;
      const address = networkData.address;
      // fetching the smart contract
      const contract = new web3.eth.Contract(abi, address);
      globalContract = contract;
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

      nakedDataHash =
        response.result[0].path !== null ? response.result[0].path : "";

      setState({ dataHash: nakedDataHash });
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

      if (nakedDataHash !== null) {
        console.log("got you here!", nakedDataHash);
        globalContract.methods
          .set(nakedDataHash)
          .send({ from: metamaskAC })
          .then(() => {
            getMethodContract();
          });
      }
      state.dataLen = tempArray.length;
    }
  });

  return <div>{state.dataHash}</div>;
};

export default App;

// setState({
//   dataHash: response.result[0].path,
// .split("https://ipfs.moralis.io:2053/ipfs/")
// .pop()
// .split("/myJson.json")[0],
// });
