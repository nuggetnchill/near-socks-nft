import 'regenerator-runtime/runtime';
import React from 'react';
import { login, logout } from './utils';
import './global.css';
import Big from 'big.js';

import getConfig from './config';
const { networkId } = getConfig(process.env.NODE_ENV || 'development');

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();
const MINT_FEE = '0.01';

export default function App() {
  // use React Hooks to store greeting in component state

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {
        // window.contract is set by initContract in index.js
        console.log("wallet connected")
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  );

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>Please connect Near Testnet wallet to check out the app.</p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Connect Wallet</button>
        </p>
      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <div style={{ float: 'right', display: 'flex' }}>
        <p>Account Id: {window.accountId}</p>
        <button className="link" onClick={logout}>
          Sign out
        </button>
      </div>
      <main>
          <h1 className="gradient-text">
           NEAR SOCKS NFT 
           <br/> <span style={{fontSize:"20px"}}>Reimagine your socks</span>
          </h1>
    <img src="https://raw.githubusercontent.com/nuggetnchill/near-socks-nft/main/asset/near-sock-with%20background.gif"/>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              // make an update call to the smart contract
              await window.contract.nft_mint(
                { 
                  receiver_id: window.accountId,
                  token_id: window.accountId,
                  metadata: {
                    title: "NEAR SOCKS",
                    media: "https://raw.githubusercontent.com/nuggetnchill/near-socks-nft/main/asset/near-sock-with%20background.gif"
                  }
                },
                  BOATLOAD_OF_GAS,
                  Big(MINT_FEE).times(10 ** 24).toFixed()
                );
            } catch (e) {
              alert(
                'Something went wrong! ' +
                  'Maybe you need to sign out and back in? ' +
                  'Check your browser console for more info.'
              );
              throw e;
            } finally {
              // re-enable the form, whether the call succeeded or failed
            }
            // show Notification
            setShowNotification(true);

            // remove Notification again after css animation completes
            // this allows it to be shown again next time the form is submitted
            setTimeout(() => {
              setShowNotification(false);
            }, 11000);
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em',
                textAlign: 'center'
              }}
            >
              0.01 Ⓝ to mint 🧦 | 1 NFT per Wallet |
              <br/>
               NFT will be burned when redeemed for real socks
            </label>
              <center>
              <button 
                className="mint-btn"
                disabled={false}
                style={{ borderRadius: '5px' }}
              >
                MINT NOW
              </button>
            <label
              htmlFor="greeting"
              style={{
                display: 'block',
                color: 'var(--gray)',
                margin: '0.5em 0',
                textAlign: 'center'
              }}
            >
              Please check your <a target="_blank" href="https://wallet.testnet.near.org/?tab=collectibles">Wallet</a> after mint for 🧦
            </label>
              </center>
          </fieldset>
        </form>

        <hr />
        <p style={{fontSize:"10px"}}>Brought to you by @nuggetnchill</p>
      </main>
      {showNotification && <Notification />}
    </>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        ' ' /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'mint_nft' in contract:{' '}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}