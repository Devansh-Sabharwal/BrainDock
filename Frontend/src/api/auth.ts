const apiUrl = import.meta.env.VITE_BASE_URL;
// api/auth.ts
interface LoginResponse {
    token: string;
  }
  
  export const loginUser = async (data: { username: string; password: string }): Promise<LoginResponse> => {
    const response = await fetch(`${apiUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  
    return response.json();
  };

  export const signupUser = async (data: { username: string; password: string })=>{
    const response = await fetch(`${apiUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      if(Array.isArray(errorData.message)) throw new Error(errorData.message[0]);
      throw new Error(errorData.message || 'Something went wrong.');
    }
  
    return response.json();
  };
 
  