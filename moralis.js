import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Moralis = require("moralis").default;
// import Web3 from "web3";
// import Meme from "../abis/Meme.json";

const App = () => {
  const [state, setState] = useState({
    data: [],
    flag: true,
    dataHash: null,
  });

  let uploadArray = [
    {
      path: "myJson.json",
      content: ["helloworld"],
    },
  ];

  const reRender = async () => {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey:
          "p1KL1YbNWDDp5dwj3Fe0Bj2faF24D6TzohCpXDs4VwjuhiI50CZj6sg9dza8ABh9",
      });
    }

    console.log('abi:::', uploadArray)
    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: uploadArray,
    });

    setState({
      dataHash: response.result[0].path,
      flag: !state.flag,
    });
  };

  useEffect(() => {
    const socket = socketIOClient("http://127.0.0.1:4001/");
    socket.on("message", (data) => {
      // console.log(uploadArray[0].content)
      setState({ data: data })
    });
    uploadArray[0].content.push(state.data);


    reRender();

    console.log("hash: ", state.dataHash);
  }, [state.flag]);

  return <div>"this is the data: " {state.dataHash}</div>;
};

export default App;
