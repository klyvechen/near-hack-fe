import { util } from './utils/util';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { utils } from 'near-api-js';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

let nfts = {}

async function handleLikelyNFTs(setShowNfts) {
  const nftContracts = await util.getLikelyNFTs()
  const viewNftMethos = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeNftMethos = []
  const walletId = util.getWallet().getAccountId()
  for (var c of nftContracts) {
    await util.connectContract(c, viewNftMethos, changeNftMethos)
    nfts[c] = await util.call(c, 'nft_tokens_for_owner', { account_id: walletId })
  }
  let show = []
  for (var prop in nfts) {
    show = [...show, ...nfts[prop]]
  }
  setShowNfts(show)
}

export default function ShowNFTs() {

  const [connected, setConnected] = useState(false);
  const [showNfts, setShowNfts] = useState([]);

  useEffect(() => {
    console.log(util.getWallet());
    setConnected(util.getWallet().isSignedIn())
    handleLikelyNFTs(setShowNfts)
  }, [connected])
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Near Hack Klyve</h2>
        {!connected ? 
          <>
            <Button variant="primary" id="btn" onClick={()=> {
              const signed = util.signIn();
              setConnected(signed)
            }}>Sign In</Button> 
            <div className="container">
            <small className="text-muted">
              Try to sign in 
            </small>
          </div>
          </>:
          <><p>Welcome <strong>{util.getWallet().getAccountId()}</strong> ! You are connected!</p>
            <Button variant="primary" id="btn" onClick={()=> {
              const out = util.signOut()
              setConnected(out)
              if (out) {
                setShowNfts([])
              }
            }}>Disconnect</Button>
          </>
        }
        { showNfts.length > 0 && showNfts.map((n, i) => {
          return <img src={n.metadata.media} key={'nft' + i}></img>
        })}
      </header>
    </div>
  );
}