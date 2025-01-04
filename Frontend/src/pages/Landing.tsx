import logo from '../assets/Logo.png'; 
import ss3 from '../assets/ss3.png'
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export function Landing() {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col justify-center"> {/* Flexbox with vertical centering */}
            <div className="h-screen bg-landing-bg md:px-20 sm:px-16 px-8 flex flex-col justify-center"> {/* Add flex to center */}
                <div className="flex py-4 bg-transparent md:justify-between justify-center">
                    <div>
                        <img src={logo} className="w-64" />
                    </div>
                    <div className="md:flex gap-4 p-4 hidden">
                        <Button variant="primary" color="white" size="lg" text="Login" onClick={() => {navigate('/login')}} />
                        <Button variant="primary" color="black" size="lg" text="SignUp" onClick={() => {navigate('/signup')}} />
                    </div>
                </div>
                <div className="h-full flex justify-between items-center"> {/* Use items-center to vertically center this */}
                    <div className="h-full">
                        <div className="h-full font-sans flex flex-col gap-2 sm:justify-center mt-32 sm:mt-0 text-white items-center sm:items-start">
                            <div className="sm:text-5xl text-4xl text-center sm:text-start">Your Official</div>
                            <div className="text-gradient bg-text-gradient sm:text-8xl text-7xl font-bold text-center sm:text-start mb-3 text-pretty">Second Brain</div>
                            <div className="sm:text-xl text-sm text-center sm:text-start text-slate-500 mb-3">Store all your links at one place</div>
                            <div className="flex justify-center sm:justify-start">
                                <Button variant="primary" color="white" size="lg" text="Login" onClick={() => {navigate('/login')}} />
                            </div>
                        </div>
                    </div>
                    <div className="sm:flex gap-2 justify-center items-center hidden overflow-hidden">
                        <img className="lg:h-96 h-80 z-10" src={ss3} />
                    </div>
                </div>
            </div>
        </div>
    );
}

