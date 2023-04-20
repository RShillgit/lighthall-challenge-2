import { useLocation } from "react-router-dom"

const Error = () => {

    const location = useLocation();

    return (
        <div>
            <h1>Oops 404 {location.pathname} Not Found</h1>
            <a href="/">
                <button>Return Home</button>
            </a>
        </div>
    )
}
export default Error