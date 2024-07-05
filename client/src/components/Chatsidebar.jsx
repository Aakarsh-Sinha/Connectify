import React from 'react';
import axios from 'axios';
import { useState,useEffect } from 'react';

function Chatsidebar({setActive}){
    const [friends,setFriends]=useState([]);
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        (async ()=>{
            try{ 
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const response=await axios.get('http://localhost:5000/api/user/getfriends',{
                    headers:{
                        Authorization:`Bearer ${token}`,
                        userId:userId
                    }
                });
                setFriends(response.data);
                
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false);
            }
        })();
    },[]);

    const sendfriend=async(user)=>{
      try{
        console.log(user);
        setActive(user);
      }catch(error){
        setError(error);
      }
    }

    if(loading){
        return <div className="w-[50vw] h-[90vh] flex items-center justify-center">Loading..........</div>
    }
    if(error){
        return <div className="w-[50vw] h-[90vh] flex items-center justify-center">{error}</div>
    }
    return (
        <div className='flex flex-col overflow-y-auto w-[25vw] border-r-2 border-gray-500'>
          <div className="p-[2vw] text-[30.6px] font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" fill="currentColor" class="bi bi-chat-left-dots-fill" viewBox="0 0 16 16" >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
            <div className="ml-[1vw] ">Messages</div>
        </div>
          <div className="grid grid-cols-1 px-[2vw] py-[1vw] gap-5">
          {friends.length > 0 ? (
          friends.map((user) => (
            <div className="flex px-[1vh] py-[1vw] text-3xl items-center w-[100%] hover:bg-purple-900 rounded-lg hover:font-bold hover:cursor-pointer" onClick={()=>sendfriend(user)}>
            <div><svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg></div>
            <div className="ml-[1vw]">{user.username}</div>
          </div>
          ))
        ) : (
          <div>You have no friends</div>
        )}
          </div>
        </div>
      );
}

export default Chatsidebar;