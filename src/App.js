import Hello from './Hello';

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
    <BrowserRouter>
      <Routes>
        <Route path="/hello" element={<Hello/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
