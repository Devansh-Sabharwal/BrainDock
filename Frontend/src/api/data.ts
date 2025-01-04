const apiUrl = import.meta.env.VITE_BASE_URL;

export const data = async ()=>{
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await fetch(`${apiUrl}/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
      }
      return response.json();
}
interface details{
    title:string,
    description:string,
    link:string,
    tags: string[]
}
export const createPost = async(details:details)=>{
    const token = localStorage.getItem('token');
    const body = details;
    const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
    }
    return response.json();
}
export const deletePost = async(contentId:string)=>{
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({contentId}),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
    }
    return response.json();
}