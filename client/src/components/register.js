import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"

const Register = (props) => {

    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate();
  
    const registerFormSubmit = (e) => {
      e.preventDefault();

      const lowerCaseName = firstName.toLowerCase();
  
      // Post request which creates a new user
      fetch(`${props.serverURL}/users`, {
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
            navigate('/login', {state: {registeredMessage: 'Registered Successfully'}});
        }
      })
      .catch(err => console.log(err))
    }
  
    return (
      <div className="App">
        <header className="App-header">
          <h1 className='registerTitle'>Register a new user</h1>

          <form className='registerForm' onSubmit={registerFormSubmit}>  
            <div className="registerInfoContainer">
              <input className='registerUser' type="text" placeholder="First Name" name="first_name" onChange={(e) => setFirstName(e.target.value)} required={true}/>
              <button>Register</button>
            </div>
          </form>

          <div className='loginLinkContainer'>
            <p className='haveAccount'>Have An Account?</p>
            <a className='loginLink' href='/login'>Login</a>
          </div>

        </header>
      </div>
    );
}

export default Register;