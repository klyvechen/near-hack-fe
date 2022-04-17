import './App.css';
import React, { useState } from 'react';
import * as nearApi from "near-api-js";
import {Buffer} from 'buffer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;


const { keyStores, KeyPair, connect, WalletConnection } = nearApi;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();
const testnetConfig = {
  networkId: "testnet",
  keyStore, 
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
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
  return await contract.hello({"name": nameArg})
}

async function nearSayHello(name) {
  const near = await connect(testnetConfig)
  let wallet  = new WalletConnection(near);
  console.log(wallet.account())
  const msg = await callContract(wallet.account(), name);
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
