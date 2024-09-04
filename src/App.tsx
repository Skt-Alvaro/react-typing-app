import logo from "./logo.svg";
import "./App.css";
import TypingArea from "./components/typing-area";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TypingArea />
      </header>
    </div>
  );
}

export default App;
