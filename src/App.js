import Hello from './Hello';
import Home from './Home';
import SignIn from './SignIn';
import ShowNFTs from './ShowNFTs';

import './App.css';
import {
  BrowserRouter,
  Routes,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Buffer} from 'buffer';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/hello" element={<Hello/>}></Route>
          <Route path="/signIn" element={<SignIn/>}></Route>
          <Route path="/showNfts" element={<ShowNFTs/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
