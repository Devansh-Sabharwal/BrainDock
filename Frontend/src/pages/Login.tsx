import { BeatLoader } from 'react-spinners';
import logo from '../assets/Logo.png'; 
import { Button } from '../components/Button';
import { Field } from '../components/Prompt';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';  
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
  export function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const {mutate , status} = useMutation({
        mutationFn:loginUser,
        onSuccess:(e)=>{
            toast.success('Login Successful!');
            localStorage.setItem('token',e.token);
            setTimeout(()=>navigate('/dashboard'),1000);
        },
        onError:(e)=>{
            toast.error(e.message||'Something went wrong', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                style:{
                    width:500
                }
                });
        }
    })
    const isLoading = status === 'pending';
    function handleLogin() {
        if (!username || !password) {
          toast.warn("Username or Password can't be empty")
          return; // Add validation or alert to fill fields
        }
        mutate({ username, password });
      }
  
    return <div className='h-screen w-screen bg-landing-bg'>
            <div className='m-auto w-[85%] h-full flex flex-col'>
            <div className="absolute w-[85%] flex py-4 bg-transparent md:justify-between justify-center">
                <div>
                    <img src={logo} className="w-64" />
                </div>
                <div className="md:flex gap-4 p-4 hidden">
                    <Button variant="primary" color="white" size="lg" text="Login" onClick={handleLogin} />
                    <Button variant="primary" color="black" size="lg" text="SignUp" onClick={() => navigate('/signup')} />
                </div>
            </div>
            <div className='flex justify-center items-center h-full'>
                <div className='p-5 rounded-lg bg-black w-[300px] sm:w-[400px] border-2 border-gray-1000 h-fit'>
                    <div className="text-white mb-5 text-xl">
                        Welcome to BrainDock
                        <div className='text-blue-400 text-sm'>
                            <span className='font-bold'>Log in</span> to sync your mind and ideas effortlessly
                        </div>
                    </div>
                    <form className="flex flex-col gap-3 text-sm">
                    <Field type={"text"} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                        setUsername(e.target.value)
                    }} title='Username' placeholder='Please Enter your Username'/>
                    <Field type={"password"} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} title='Password' placeholder='Please Enter your Password'/>
                    </form>
                    <div className='text-gray-400 text-sm mt-4'>
                         New to our platform?
                    </div>
                    {!isLoading && <div className='flex justify-between items-center  text-white'>
                        <div
                            onClick={() => navigate('/signup')}
                            className='hover:cursor-pointer hover:text-blue-500 hover:underline px-2 py-1 rounded transition-all duration-300'
                            >
                            Create Account
                        </div>

                        <Button variant="primary" color="white" size="md" text="Login" onClick={handleLogin} />
                    </div>}
                    {isLoading && <div className='flex justify-center'><BeatLoader color='white' size={10}/></div>}
                </div>
            </div>
        </div>
        </div>
}