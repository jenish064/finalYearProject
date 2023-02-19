import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Moralis = require("moralis").default;
// import Web3 from "web3";
// import Meme from "../abis/Meme.json";

const App = () => {
  const [state, setState] = useState({
    maxArrayLen: 0,
    flag: true,
    dataHash: null,
    uploadArray: [
      {
        path: "myJson.json",
        content: ["helloworld"],
      },
    ],
  });

  // let tempArray = [];
  // let uploadArray = [
  //   {
  //     path: "myJson.json",
  //     content: ["helloworld"],
  //   },
  // ];

  const reRender = async () => {
    console.log("entered into reRender!");
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey:
          "p1KL1YbNWDDp5dwj3Fe0Bj2faF24D6TzohCpXDs4VwjuhiI50CZj6sg9dza8ABh9",
        // "GFJ8vWRvbbJKjk3ajmfHDeVyNqF0JXw48TzB0QcyTL4YT1Mi4jwfo8FvRXdIa6XP",
      });
    }

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: state.uploadArray,
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
      // setState({ data: data });
      // tempArray.push(data);
      const tempArray = { ...state.uploadArray };
      console.log(tempArray[0].content);

      tempArray[0].content.push(data);

      if (
        tempArray[0].content.length % 10 === 0 &&
        tempArray[0].content.length === state.maxArrayLen + 10
      ) {
        setState({
          maxArrayLen: tempArray[0].content.length,
          uploadArray: tempArray,
        });
        console.log("tempArray:...:", tempArray);
        console.log("maxArrLen:...", state.maxArrayLen);

        reRender();
      }
    });
  }, [state.dataHash]);

  return <div>"this is the data: " {state.dataHash}</div>;
};

export default App;
