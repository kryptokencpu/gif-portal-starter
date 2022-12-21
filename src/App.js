/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';


const TEST_GIFS = [
  'https://media3.giphy.com/media/0RiL76Qdbg7b4maVY6/giphy.gif?cid=ecf05e47rqqriinh23jt2b45o9cra9g9he8usq6kmtwc7ay7&rid=giphy.gif&ct=g',
	'https://media2.giphy.com/media/zt6XoZ4r6nHVJO5cnM/giphy.gif?cid=ecf05e471lvjuj3qw8lm0jzihvb69m7m5i719utjeky5bfas&rid=giphy.gif&ct=g',
	'https://media3.giphy.com/media/bMycGOQLESDCEnLNUz/giphy.gif?cid=ecf05e47rqqriinh23jt2b45o9cra9g9he8usq6kmtwc7ay7&rid=giphy.gif&ct=g'

]
// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
  // We're using optional chaining (question mark) to check if the object is null
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');

      const response = await window.solana.connect({ onlyIfTrusted: true});
      console.log(
        'Connected with Public Key',
        response.publicKey.toString()
      );


      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
      } else {
        console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => {
    return <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    > Connect to Wallet
    </button>
  };

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}>
        <input 
        type="text" 
        placeholder="Enter gif link!" 
        value={inputValue}
        onChange={onInputChange}  
      />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif}/>
        </div>
        ))}
      </div>
    </div>
  );

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list....');

      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
        
      <div className="container">
        <div className="header-container">
          <p className="header">Up Only Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;