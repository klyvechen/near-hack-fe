import './App.css';
import React, { useEffect, useState } from 'react';
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

let near;
let wallet;

async function signOut() {
  await wallet.signOut();
}

async function signIn() {
  wallet.requestSignIn()
}

async function initPage(setConnected) {
  near = await connect(testnetConfig)
  wallet = new WalletConnection(near)
  setConnected(wallet.isSignedIn())
}

function SignIn() {

  const [connected, setConnected] = useState(false);

  useEffect(()=> {
    initPage(setConnected)
  })
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Near Hack Klyve</h2>
        {!connected ? 
          <>
            <Button variant="primary" id="btn" onClick={()=> {
              const signed = signIn();
              setConnected(signed)
            }}>Sign In</Button> 
            <div className="container">
            <small className="text-muted">
              Try to sign in 
            </small>
          </div>
          </>:
          <>Welcome! You are connected!
          <Button variant="primary" id="btn" onClick={()=> {
            signOut()
            setConnected(false)
          }}>Disconnect</Button>
          </>
        }
      </header>
    </div>
  );
}

export default SignIn;
