import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css"

const Login = (props) => {

    const [firstName, setFirstName] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [registeredSuccessfullyMessage, setRegisteredSuccessfullyMessage] = useState("");
    const {state} = useLocation();
    const navigate = useNavigate();

    // On mount
    useEffect(() => {

      // If there is a "registered successfully" message
      if(state && state.registeredMessage) {
        setRegisteredSuccessfullyMessage(
          <div className="registeredSuccessfullyMessage">
            <p>{state.registeredMessage}</p>
          </div>
        )
      }

      // On page refresh, remove registeredMessage from state
      window.history.replaceState({}, document.title)

    }, [])

    const loginFormSubmit = (e) => {
      e.preventDefault();

      // Convert name to all lowercase
      const lowerCaseName = firstName.toLowerCase();
  
      // POST request to login route ot check if user exists
      fetch(`${props.serverURL}/login`, {
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
          setErrorMessage(
            <div className='errorMessage'>
              {data.error}
            </div>
          );
        }
      })
      .catch(err => console.log(err))
    }

    return (
        <div className='loginContainer'>

          <h1 className='title'>Task Tracker</h1>

          <form className='loginForm' onSubmit={loginFormSubmit}>
            <input className='userName' type="text" name="first_name" placeholder="Name" onChange={(e) => setFirstName(e.target.value)} required={true}/>
            <button className='login'>Log In</button>
          </form>

          <div className='registerContainer'>
            <p className='newUser'>New User: </p>
            <a className='register' href='/register'>Register</a>
          </div>

          {errorMessage}

          {(state && state.registeredMessage)
            ?
            <>
            {(errorMessage)
              ? <></>
              :
              <>
                {registeredSuccessfullyMessage}
              </>
            }
            </>
            :<></>
          }

        </div>
    )

}
export default Login;