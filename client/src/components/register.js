import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate();
  
    const registerFormSubmit = (e) => {
      e.preventDefault();

      const lowerCaseName = firstName.toLowerCase();
      console.log(lowerCaseName)
  
      // Post request which creates a new user
      fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({lowerCaseName})
      })
      .then(res => res.json())
      .then(data => {
        
        // If creating the new user was successful
        if(data.success) {
            // Navigate to the home page
            navigate('/login');
        }
      })
      .catch(err => console.log(err))
    }
  
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={registerFormSubmit}>
            <h1>Register a new user</h1>
            <input type="text" placeholder="First Name" name="first_name" onChange={(e) => setFirstName(e.target.value)}/>
            <button>Register</button>
          </form>
        </header>
      </div>
    );
}

export default Register;