import React, { useEffect, useState } from 'react';
import Profiletile from './Profiletile';
import axios from 'axios';


function Addfriend(){
    const [users,setUsers]=useState([]);
    const[error,setError]=useState("");
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        (async ()=>{
            try{ 
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const response=await axios.get('http://localhost:5000/api/user/getusers',{
                    headers:{
                        Authorization:`Bearer ${token}`,
                        userId:userId
                    }
                });
                setUsers(response.data);
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false);
            }
        })();
    },[]);
    if(loading){
        return <div>{loading}</div>
    }
    if(error){
        return <div>{error}</div>
    }
    return <div className="p-4">
        <h1 className='font-bold text-3xl p-2 '>Search for people:</h1>
        <div className='p-2'>
            <input className='w-[100%] bg-gray-600 rounded-xl p-2' placeholder='Search....'/>
        </div>
        <div className='grid grid-cols-1 gap-5'>
            {users.map(user => (
                <Profiletile user={user}/>
            ))}
        </div>

    </div>
}

export default Addfriend;