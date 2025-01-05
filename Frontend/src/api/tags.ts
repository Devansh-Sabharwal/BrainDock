const apiUrl = import.meta.env.VITE_BASE_URL;

export const getTags = async (title:string)=>{
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/content/tag`,{
        method:'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title})
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
      }
      return response.json();
}

export const getUserTags = async (details:string)=>{
    const [title, userId] = details.split(' ')
    const response = await fetch(`${apiUrl}/fetchTags?userId=${userId}&tag=${title}`,{
        method:'GET',
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
      }
      return response.json();
}