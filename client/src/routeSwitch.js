import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./components/register";
import Error from "./components/error";
import Login from "./components/login";

const RouteSwitch = () => {

    const serverURL = 'http://localhost:8000' // TODO: Change to deployment server

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App serverURL={serverURL}/>}/>
                <Route path="/login" element={ <Login serverURL={serverURL}/>}/>
                <Route path="/register" element={ <Register serverURL={serverURL}/>}/>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch;