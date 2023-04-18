import logo from './logo.svg';
import {useState, useRef} from 'react';
import './App.css';

function App() {

  const [firstName, setFirstName] = useState();
  
  const loginFormSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8000/users', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      mode: 'cors',
      body: JSON.stringify({firstName})
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={loginFormSubmit}>
          <input type="text" name="first_name" onChange={(e) => setFirstName(e.target.value)}/>
          <button>Log In</button>
        </form>
      </header>
    </div>
  );
}

export default App;
