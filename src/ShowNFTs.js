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
let ft_contract;
let ftContractName = 'klyve-hack-ft.klyve-hack.testnet';
let nftContractName = 'klyve-hack-nft.klyve-hack.testnet';

const ONE_NEAR = 1000000000000000000000000;

async function mintByNear(amount) {
  const walletId = util.getWallet().getAccountId()
  const yoctoAmount = (amount * 1000000000000000000000000).toLocaleString('fullwide', { useGrouping: false }) 
  await util.call(nftContractName, 'nft_mint_pay', [{ account_id: walletId }, "300000000000000", yoctoAmount])
}


async function mintByFt() {
  const yoctoAmount = (0.01 * 1000000000000000000000000).toLocaleString('fullwide', { useGrouping: false }) 
  await util.call(nftContractName, 'nft_mint_by_ft', [{ ft_amount: "200" }, "300000000000000", yoctoAmount])

}

async function showFtBalance(setFtBalance) {
  const walletId = util.getWallet().getAccountId()
  const result = await util.call(ftContractName, 'ft_balance_of', [{ account_id: walletId }])
  console.log(result)
  setFtBalance(result)
}

async function ftFaucet() {
  // const result1 = await util.call(ft_contract, 'ft_transfer', { sender_id: "", amount: "100" })`
  const yoctoAmount = await util.call(ftContractName, 'storage_balance_of', [{ sender_id: "klyve-hack.testnet"}]) != null ? 1 : 0.01 * ONE_NEAR
  const yoctoString = yoctoAmount.toLocaleString('fullwide', { useGrouping: false })
  await util.call(ftContractName, 'ft_transfer_from', [{ sender_id: "klyve-hack.testnet", amount: 100}, "300000000000000", yoctoString])
}

async function connectNFtContract() {
  const viewMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeMethods = ['nft_mint_pay', 'nft_mint_by_ft']
  await util.connectContract(nftContractName, viewMethods, changeMethods)
}


async function connectFtContract() {
  const viewMethods = ['ft_balance_of', 'storage_balance_of']
  const changeMethods = ['ft_transfer', 'ft_transfer_from']
  await util.connectContract(ftContractName, viewMethods, changeMethods)
}


async function handleLikelyNFTs(setShowNfts) {
  const nftContracts = await util.getLikelyNFTs()
  var filtered = nftContracts.filter(function(value, index, arr){ 
    return value !== nftContractName;
  });
  filtered = [nftContractName, ...filtered]
  const viewNftMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeNftMethods = []
  const walletId = util.getWallet().getAccountId()
  for (var c of filtered) {
    await util.connectContract(c, viewNftMethods, changeNftMethods)
    nfts[c] = await util.call(c, 'nft_tokens_for_owner', [{ account_id: walletId }])
  }
  let show = []
  for (var prop in nfts) {
    show = [...show, ...nfts[prop]]
  }
  setShowNfts(show)
}

async function initPage(setShowNfts, setFtBalance) {
  handleLikelyNFTs(setShowNfts)
  await connectFtContract()
  showFtBalance(setFtBalance)
  await connectNFtContract()
}



export default function ShowNFTs() {

  const [connected, setConnected] = useState(false);
  const [showNfts, setShowNfts] = useState([]);
  const [ftBalance, setFtBalance] = useState(0);
  const [amountToMint, setAmountToMint] = useState(1);

  useEffect(() => {
    console.log(util.getWallet());
    setConnected(util.isConnected())
    if (util.getWallet().isSignedIn()) {
      initPage(setShowNfts, setFtBalance)
    }
  }, [connected])
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Near Hack klyve</h2>
        <h3>mint & show NFTs</h3>
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
          <>
            <p>Welcome <strong>{util.getWallet().getAccountId()}</strong> ! You are connected!</p>
            <p>Your <strong>Big Nana</strong>  Balance: {ftBalance / 100}</p>
            <Button variant="primary" id="btn" onClick={()=> {
              const out = util.signOut()
              setConnected(out)
              if (out) {
                setShowNfts([])
              }
            }}>Disconnect</Button>
          </>
        }
        {connected &&
          <div className="w-60">
            <div className="border border-secondary">
              <div>
                Mint the NFT
              </div>
              <Button variant="primary" id="mint" onClick={()=> {
                mintByNear(amountToMint)
              }}>Mint By Near</Button>
              amount <input  style={{width: "100px", textAlign: "center"}} type="text" value={amountToMint} onChange={(e)=>{setAmountToMint(e.target.value)}}/>
              N to mint 
              <br/>
              <Button variant="primary" id="mint" onClick={()=> {
                mintByFt()
              }}>Mint By Big Nana</Button>
              <Button variant="primary" id="mint" onClick={()=> {
                ftFaucet()
              }}>Big Nana Faucet</Button>
            </div>
            <div className="border border-secondary">
              <div>
                Your currnet NFTs
              </div>
              { showNfts.length > 0 && showNfts.map((n, i) => {
                return <div className="card" key={'nft-card' + i}>
                <img className="card-img-top" alt="Card image cap" src={n.metadata.media} key={'nft' + i}></img>
                <div className="card-body">
                  <h5 className="card-title text-primary">{n.metadata.title}</h5>
                  <p className="card-text text-secondary">{n.metadata.description}</p>
                  {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </div>
                </div> })}
            </div>
          </div>
        }

      </header>
    </div>
  );
}