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
  const walletId = util.getWallet().getAccountId()
  const yoctoAmount = await util.call(ftContractName, 'storage_balance_of', [{ account_id: walletId}]) != null ? 1 : 0.01 * ONE_NEAR
  const yoctoString = yoctoAmount.toLocaleString('fullwide', { useGrouping: false })
  await util.call(ftContractName, 'faucet', [{}, "300000000000000", yoctoString])
}

async function connectNFtContract() {
  const viewMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeMethods = ['nft_mint_pay', 'nft_mint_by_ft']
  await util.connectContract(nftContractName, viewMethods, changeMethods)
}


async function connectFtContract() {
  const viewMethods = ['ft_balance_of', 'storage_balance_of']
  const changeMethods = ['ft_transfer', 'ft_transfer_from', 'faucet']
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

async function initPage(setShowNfts, setFtBalance, setConnected) {
  setConnected(util.isConnected())
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
    console.log(util.getWallet())
    console.log(util.isConnected())
    if (util.getWallet().isSignedIn()) {
      initPage(setShowNfts, setFtBalance, setConnected)
    }
  }, [connected])
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2 style={{color: "teal"}}>Near Hack klyve</h2>
        <h3>mint & show NFTs</h3>
        {!connected ? 
          <>
            <Button variant="primary" id="btn" onClick={()=> {
              util.signIn();
            }}>Sign In</Button> 
            <div className="container">
              <small className="text-muted">
                Try to sign in 
              </small>
            </div>
          </>:
          <>
            <p>Welcome <strong style={{color: "silver"}}>{util.getWallet().getAccountId()}</strong> ! You are connected!</p>
            <p>Your <strong>$Big Nana</strong>  Balance: {ftBalance / 100}</p>
            <Button variant="primary" id="btn" onClick={()=> {
              util.signOut()
              setConnected(false)
              setShowNfts([])
            }}>Disconnect</Button>
          </>
        }
        {connected &&
          <div style={{width:"60%"}} >
            <div className="border border-secondary">
              <div className="border border-secondary">
                <div className="row">
                  <div className="col-12">
                    Mint nft by NEAR
                  </div>
                  <div className="col-4">
                    <Button variant="primary" id="mint" onClick={()=> {
                      mintByNear(amountToMint)
                    }}>Mint By Near</Button>
                  </div>
                  <div className="col-8">
                    <small style={{fontSize:"20px"}} >
                      use
                      <input style={{width: "50px", textAlign: "center"}} type="text" value={amountToMint} onChange={(e)=>{setAmountToMint(e.target.value)}}/>
                      N to mint 
                    </small> 
                  </div>
                  <div className="col-12">
                    <small style={{fontSize:"16px"}} >
                      Mint the nft by the $Near 
                      You need 1 $Near to mint<br/> 
                      If you enter a number over than 1, 
                      we will refund the extra amount back to you. <br/>
                    </small>
                  </div>
                  <br/>
                </div>
              </div>
              <div className="border border-secondary">
                <div className="row">
                  <div className="col-12">
                    Mint nft by Fungible-Token
                  </div>
                  <div className="col-4">
                    <Button variant="primary" id="mint" onClick={()=> {
                      mintByFt()
                    }}>Mint By Big Nana</Button>
                  </div>
                  <div className="col-8">
                    <Button variant="primary" id="mint" onClick={()=> {
                      ftFaucet()
                    }}>Big Nana Faucet</Button>
                  </div>
                  <div className="col-12">
                    <small style={{fontSize:"16px"}}>
                      Mint the nft by the fungible token $Big Nana. 
                      If you want to use the $Big Nana to mint,<br/> 
                      please use the faucet to get the $Big Nana first, 
                      and you have enough $Big Nana to mint. <br/> 
                      You will get 10 $Big Nana for every faucet. <br/> 
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-secondary">
              <div>
                Your currnet NFTs
              </div>
              <div className="row">      
                { showNfts.length > 0 && showNfts.map((n, i) => {
                  return ( 
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="card d-flex justify-content-around" key={'nft-card' + i}>
                        <img className="card-img-top" alt="Card image cap" src={n.metadata.media} key={'nft' + i}></img>
                        <div className="card-body">
                          <h5 className="card-title text-primary">{n.metadata.title}</h5>
                          <p className="card-text text-secondary">{n.metadata.description}</p>
                          {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                      </div>
                    </div>)
                })}
              </div>
            </div>
          </div>
        }

      </header>
    </div>
  );
}