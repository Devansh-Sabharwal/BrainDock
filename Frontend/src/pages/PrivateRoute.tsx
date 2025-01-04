const apiUrl = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RingLoader } from "react-spinners";
import { toast } from 'react-toastify';

export const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<any>(null); // Track authentication status
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    useEffect(() => {
        // Verify token with backend if it exists
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await fetch(`${apiUrl}/get`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false); 
            }
        };
        verifyToken();
    },);
    if (isAuthenticated === null) {
        return <div className='h-screen w-screen flex justify-center items-center bg-black'>
            <div className='flex flex-col gap-4 justify-center items-center'>
                <RingLoader size={80} color='white'/>
                <div className='text-white text-3xl font-medium'> Please Wait...</div>
            </div>
        </div>;
    }
    // If not authenticated, redirect to the login page
    if (isAuthenticated === false) {
        toast.error('Authentication failed!');
        return <Navigate to="/login" />;
    }

    // If authenticated, render the protected route
    return <Outlet />;
};
