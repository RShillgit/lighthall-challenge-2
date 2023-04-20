import { useLocation } from "react-router-dom"

const Error = () => {

    const location = useLocation();

    return (
        <div>
            <h1 className='errorTitle'>Oops 404 "{location.pathname}" Not Found</h1>
            <a className='returnHome' href="/">
                <button>Return Home</button>
            </a>
        </div>
    )
}
export default Error