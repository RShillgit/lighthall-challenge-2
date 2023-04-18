import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [firstName, setFirstName] = useState();
    const navigate = useNavigate();
  
    const loginFormSubmit = (e) => {
      e.preventDefault();
  
      // POST request to login route ot check if user exists
      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({firstName})
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        // If user exists, route them to the "Home" page
        if(data.success) {
            navigate('/');
        }
      })
      .catch(err => console.log(err))
    }

    return (
        <div>
            <form onSubmit={loginFormSubmit}>
                <input type="text" name="first_name" onChange={(e) => setFirstName(e.target.value)}/>
                <button>Log In</button>
                <a href='/register'>Register</a>
            </form>
        </div>
    )

}
export default Login;