// {`https://ipfs.infura.io/ipfs/${state.memeHash}`}

import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

const Moralis = require('moralis').default;
// import Web3 from "web3";
// import Meme from "../abis/Meme.json";

const App = () => {
  const [state, setState] = useState({
    data: '',
    dataHash: null,
  });

  let uploadArray = [
    {
      path: "myJson.json",
      content: [],
    }
  ];

  const reRender = async () => {
    await Moralis.start({
      apiKey: "GFJ8vWRvbbJKjk3ajmfHDeVyNqF0JXw48TzB0QcyTL4YT1Mi4jwfo8FvRXdIa6XP",
    })

    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi: uploadArray, });

    console.log("hash: ", dataHash)

    setState({
      dataHash: uploadArray[0].path
    })

  }


  useEffect(() => {
    const socket = socketIOClient("http://127.0.0.1:4001/");
    socket.on("message", (data) => {
      // console.log(uploadArray[0].content)
      uploadArray[0].content.push(data)

      reRender();
    });
  }, []);

  return (
    <div>
      "this is the data: " {state.dataHash}
    </div>
  )
}

export default App;
