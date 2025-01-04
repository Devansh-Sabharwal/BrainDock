const apiUrl = import.meta.env.VITE_BASE_URL;
export const shareContent = async (share:boolean)=>{
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/brain/share`,{
        method:'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({share})
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
    }
    return response.json();
}
export const shareStatus = async()=>{
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/brain/status`,{
        method:'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
    }
    return response.json();
}
export const getShare = async(hash:string)=>{
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/brain/${hash}`,{
        method:'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
    }
    return response.json();
}