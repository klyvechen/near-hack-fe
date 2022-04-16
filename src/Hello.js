import './App.css';
import React, { useState } from 'react';
import * as nearApi from "near-api-js";
import {Buffer} from 'buffer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

async function login(accountName, contract, params) {
  const { keyStores, KeyPair, connect } = nearApi;
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = "ed25519:35xBX9pb68LiGhDYD7EMvcfJ2EnMuqt3GV6Kt89RJDWKozDZZppZd3pvUhaLRDyBJgQZqh2kck3zE6f22zqThYp8";
  console.log(keyPair.secretKey)
  await keyStore.setKey("testnet", "klyve-hack.testnet", keyPair)
  const config = {
      networkId: "testnet",
      keyStore, 
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
  };
  const near = await connect(config)
  const account = await near.account(accountName);
  console.log(await account.state())
  return account
}

async function callContract(account, nameArg) {
  console.log(account)
  const contract = await new nearApi.Contract(
      account, // the account object that is connecting
      "klyve-hack.testnet",
      {
          // name of contract you're connecting to
          viewMethods: ["hello"], // view methods do not change state but usually return a value
          changeMethods: [""], // change methods modify state
          sender: account, // account object to initialize and sign transactions.
      }
  );
  console.log(contract)
  const result = await contract.hello({"name": nameArg})
  console.log(result)
  return result;
}

async function nearSayHello(name) {
  const account = await login("klyve-hack.testnet");
  const msg = await callContract(account, name);
  alert(msg)
}

function Hello() {
  const [name, setName] = useState("John");
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Near Hack Klyve</h2>
        <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <br/>
        <Button variant="primary" id="btn" onClick={()=> {
          console.log("name: " + name)
          nearSayHello(name);
        }}>Say Hello</Button>
        <div className="container">
          <small className="text-muted">
            It calls the view function on klyve-hack.testnet to get the result. 
          </small>
          <br/>
          <small className="text-muted">
            The action is done at the browser.
          </small>
        </div>
      </header>
    </div>
  );
}

export default Hello;
