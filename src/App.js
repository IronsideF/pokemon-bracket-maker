import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import BracketSelector from "./pages/BracketSelector";
import BracketView from './pages/BracketView';


function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path='/BracketSelector' element={<BracketSelector/>}/>
        <Route path='/BracketView' element={<BracketView/>}/>
      </Routes>
    </Router>
  );
}

<div className="App">
      <header className="App-header">
      <h1>Welcome to the unofficial Pokemon Bracket Maker</h1>
      
      
      </header>
    </div>

export default App;
