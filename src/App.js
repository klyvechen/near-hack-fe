import Hello from './Hello';

import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Buffer} from 'buffer';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  return (
    <Router path="/hello">
        <Hello/>
    </Router>
  );
}

export default App;
