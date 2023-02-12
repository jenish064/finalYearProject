import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Moralis = require("moralis").default;
// import Web3 from "web3";
// import Meme from "../abis/Meme.json";

const App = () => {
  const [state, setState] = useState({
    data: "",
    flag: true,
    dataHash: null,
  });

  let uploadArray = [
    {
      path: "myJson.json",
      content: ["hello"],
    },
  ];

  const reRender = async () => {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey:
          "GFJ8vWRvbbJKjk3ajmfHDeVyNqF0JXw48TzB0QcyTL4YT1Mi4jwfo8FvRXdIa6XP",
      });
    }

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: uploadArray,
    });

    setState({
      dataHash: response.result[0].path,
      flag: !state.flag,
    });

    console.log("response.result::", response.result[0].path);
  };

  useEffect(() => {
    const socket = socketIOClient("http://127.0.0.1:4001/");
    socket.on("message", (data) => {
      // console.log(uploadArray[0].content)
      uploadArray[0].content.push(data);
      console.log(uploadArray[0].content);
    });

    reRender();

    console.log("hash: ", state.dataHash);
  }, [state.flag]);

  return <div>"this is the data: " {state.dataHash}</div>;
};

export default App;
