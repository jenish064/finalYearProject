import React, { useState } from "react";
import socketIOClient from "socket.io-client";

const Moralis = require("moralis").default;
// import Web3 from "web3";
// import Meme from "../abis/Meme.json";

const App = () => {
  const [state, setState] = useState({
    flag: true,
    dataHash: null,
    dataLen: 0,
  });

  let tempArray = [];
  let uploadArray = [
    {
      path: "myJson.json",
      content: ['helloData'],
    },
  ];

  const reRender = async () => {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey:
          'GFJ8vWRvbbJKjk3ajmfHDeVyNqF0JXw48TzB0QcyTL4YT1Mi4jwfo8FvRXdIa6XP',
        // "p1KL1YbNWDDp5dwj3Fe0Bj2faF24D6TzohCpXDs4VwjuhiI50CZj6sg9dza8ABh9",
      });
    }

    console.log('abi:::', uploadArray)
    if (uploadArray[0].content.length === state.dataLen + 10) {
      console.log("data length:>", state.dataLen);
      const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: uploadArray,
      });

      setState({
        dataHash: response.result[0].path,
      });
    }

  };

  const socket = socketIOClient("http://127.0.0.1:4001/");
  socket.on("message", (data) => {
    tempArray.push(data)

    if ((tempArray.length % 10 === 0) && (tempArray.length === state.dataLen + 10)) {
      uploadArray[0].content = tempArray;
      console.log(uploadArray[0].content);
      reRender();

      state.dataLen = tempArray.length;
    }
  });

  return <div>{state.dataHash}</div>;
};

export default App;
