import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function Sentrequests() {
  const [username,setUsername]=useState(["No pending sent requests"]);
  const [error,setError]=useState("");
  useEffect(()=>{
    (async()=>{
        try{
          const token=localStorage.getItem("token");
          const userId=localStorage.getItem("userId");
          const response=await axios.get('http://localhost:5000/api/user/sentrequests',{
            headers:{
              Authorization:token,
              userId:userId
            }
          });
          setUsername(response.data);
        }catch(error){
            setError(error.message);
        }
    })();
  },[]);
  if(error){
    return <div>{error}</div>
  }
  return (
    <div className="p-[2vw]">
      <div className=" text-3xl font-bold">Pending Sent Requests</div>
        <div className='grid grid-cols-1 gap-5'>
        {username.length > 0 ? (
          username.map((username, index) => (
            <div key={index}>{username}</div>
          ))
        ) : (
          <div>No pending sent requests</div>
        )}
        </div>
    </div>
  );
}

export default Sentrequests;
