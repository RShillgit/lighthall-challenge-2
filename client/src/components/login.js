import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"

const Login = () => {

    const [firstName, setFirstName] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
  
    const loginFormSubmit = (e) => {
      e.preventDefault();

      // Convert name to all lowercase
      const lowerCaseName = firstName.toLowerCase();
  
      // POST request to login route ot check if user exists
      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({lowerCaseName})
      })
      .then(res => res.json())
      .then(data => {

        // If user exists, route them to the "Home" page
        if(data.success) {

          localStorage.setItem('UserId', data.foundUser._id)

          navigate('/');
        }
        // Else render error message
        else {
          setErrorMessage(data.error);
        }
      })
      .catch(err => console.log(err))
    }

    return (
        <div classsName='loginContainer'>
          <h1 className='title'>Task Tracker</h1>
          <form className='loginForm' onSubmit={loginFormSubmit}>
            <input className='userName' type="text" name="first_name" placeholder="Name" onChange={(e) => setFirstName(e.target.value)}/>
            <button className='login'>Log In</button>
          </form>
          <div className='registerContainer'>
            <p className='newUser'>New User: </p>
            <a className='register' href='/register'>Register</a>
          </div>
            
            {errorMessage}
        </div>
    )

}
export default Login;