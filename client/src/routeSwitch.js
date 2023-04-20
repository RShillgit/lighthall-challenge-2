import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./components/register";
import Error from "./components/error";
import Login from "./components/login";

const RouteSwitch = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}/>
                <Route path="/login" element={ <Login />}/>
                <Route path="/register" element={ <Register />}/>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch;