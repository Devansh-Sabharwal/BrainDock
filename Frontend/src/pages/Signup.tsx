import logo from '../assets/Logo.png'; 
import { Button } from '../components/Button';
import { Field } from '../components/Prompt';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export function SignUp(){
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const navigate = useNavigate()
        const {mutate,status} = useMutation({
            mutationFn:signupUser,
            onSuccess:(e)=>{
                toast.success(e.message || 'Your account has been created. Log in to access your dashboard', {
                    style: { 
                      width: '550px',
                    },
                  });
                navigate('/login')
            },
            onError:(e)=>{
                toast.error(e.message || 'Something went wrong');
                setUsername('');
                setPassword('');
            }
        })
        const isLoading = status=="pending"
        const handleSignup = ()=>{
            if(!username || !password){
                toast.warn("Username or Password can't be empty");
                return
            }
            mutate({username,password});
        }
    return <div className='h-screen w-screen bg-landing-bg'>
            <div className='m-auto w-[85%] h-full flex flex-col'>
            <div className="absolute w-[85%] flex py-4 bg-transparent md:justify-between justify-center">
                <div>
                    <img src={logo} className="w-64" />
                </div>
                <div className="md:flex gap-4 p-4 hidden">
                    <Button variant="primary" color="white" size="lg" text="Login" onClick={() => navigate('/login')} />
                    <Button variant="primary" color="black" size="lg" text="SignUp" onClick={handleSignup} />
                </div>
            </div>
            <div className='flex justify-center items-center h-full'>
                <div className='p-5 rounded-lg bg-black w-[300px] sm:w-[400px] border-2 border-gray-1000 h-fit'>
                    <div className="text-white mb-5 text-xl">
                        Welcome to BrainDock
                        <div className='text-blue-400 text-sm'>
                        Please Signup
                        </div>
                    </div>
                    <form className="flex flex-col gap-3 text-sm">
                    <Field type={"text"} value={username} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)} title='Username' placeholder='Please Enter your Username'/>
                    <Field type={"password"} value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} title='Password' placeholder='Please Enter your Password'/>
                    </form>
    
                    <div className='flex justify-between items-center  text-white mt-4'>
                        <div onClick={()=>navigate('/login')} className='text-xs md:text-sm hover:cursor-pointer hover:underline hover:text-blue-500'>Already have an account?</div>
                        {!isLoading && <Button variant="primary" color="white" size="md" text="Signup" onClick={handleSignup} />}
                        {isLoading && <div className='flex justify-center'><BeatLoader color='white' size={10}/></div>}
                        
                    </div>
                </div>
            </div>
        </div>
        </div>
}


