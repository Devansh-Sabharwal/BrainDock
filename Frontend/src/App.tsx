import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./pages/PrivateRoute";
import { SignUp } from "./pages/Signup";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import {Share} from './pages/Share'
import { NotFound } from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
export default function App(){
    return<><BrowserRouter>
    <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/error" element={<NotFound/>}/>
        <Route element={<PrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        
        <Route path="/share/:hash" element={<Share />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
    <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
    />
    </> 
}