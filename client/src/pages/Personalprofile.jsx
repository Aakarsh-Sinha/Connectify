import React, { useEffect } from 'react';

import { useState } from 'react';
import Postcard from '../components/Postcard';
import axios from 'axios';
function Personalprofile(){
    
    const [posts,setPosts]=useState([]);
    const [user,setUser]=useState({});
    const [friends,setFriends]=useState([]);
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(true);
    const [image,setImage]=useState("");
    const [caption,setCaption]=useState("");
    const [postCreated, setPostCreated] = useState(false);
    useEffect(()=>{
        (async ()=>{
            try{ 
                const token = localStorage.getItem("token");
                const userId =localStorage.getItem("userId");
                
                const response=await axios.get('http://localhost:5000/api/user/userposts',{
                    params: { userId },
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                });
                setPosts(response.data.posts);
                setFriends(response.data.friends);
                setUser({username:response.data.user.username});
                console.log(response.data);
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false);
            }
        })();
    },[postCreated]);
    function convert(e){
        console.log(e);
        var reader=new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload=()=>{
            console.log(reader.result);
            setImage(reader.result);
        };
        reader.onerror=error=>{
            console.log("Error: ",error);
        }
    }
    const createpost=async ()=>{
        try{ 
            const token = localStorage.getItem("token");
            const userId =localStorage.getItem("userId");
            
            const response = await axios.post('http://localhost:5000/api/user/createpost', {
                base64: image,
                caption: caption
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userId: userId
                }
            });
            console.log(response.data);
            setPostCreated(true);
        }catch(error){
            setError(error.message)
        }finally{
            setLoading(false);
        }
    }
    if(loading){
        return <div>{loading}</div>
      }
      if(error){
        return <div>{error}</div>
      }
    return <>
    <div className="pl-[10vw] pt-[3vw] pr-[10vw] flex justify-around flex-col items-center">
      <div className='flex justify-around w-[60%] font-bold text-2xl  border-1 border-b border-white p-[1vw]'>
        <div className="pfp w-[30vw] h-[30vw] lg:w-[20vw] lg:h-[20vw] xl:w-[15vw] xl:h-[15vw] relative">
          <div className='border-2 border-solid rounded-full border-white w-full h-full flex items-center justify-center'>
            PFP
          </div>
        </div>
        <div className="flex flex-col justify-center w-[50%]">
          <div className="p-[1vw]">{user.username}</div>
          <div className="flex items-center space-x-4">
            <div className="p-[1vw]">{posts.length} Posts</div>
            <div className="p-[1vw]">{friends.length} Friends</div>
          </div>
          <input accept="image/*" type="file" onChange={convert} className="bg-gray-600 w-[100%]"/>
          <input onChange={e=>{
                        setCaption(e.target.value);
                        
                    }}/>
          <button type="button" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"onClick={createpost}>Create Post</button>

        </div>
      </div>
      <div className="w-[70%] flex justify-around p-[1vw] font-bold text-2xl">Posts</div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-items-center">
            {posts.length>0 ?(posts.map(post => (
                <Postcard post={post}/>
            ))):<div className="   font-bold text-2xl col-span-3 row-span-10">This user has not posted...</div>}
      </div>
    </div>
    </>
}

export default Personalprofile;