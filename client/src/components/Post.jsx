import axios from "axios";
import React, { useState,useEffect } from "react";
import Postcard from "./Postcard";
function Post(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts,setPosts]=useState([]);
    useEffect(()=>{
        (async ()=>{
            try{ 
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const response=await axios.get('http://localhost:5000/api/user/getposts',{
                    headers:{
                        Authorization:`Bearer ${token}`,
                        userId:userId
                    }
                });
                setPosts(response.data);
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false);
            }
        })();
    },[]);
    if (loading) {
        return <div className="w-full h-full flex items-center justify-around"><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 200 200"><circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FF156D" stroke="#FF156D" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return(
        <div className="grid grid-cols-1 place-items-center gap-5">
            {posts.length>0 ?(posts.map(post => (
                <Postcard post={post}/>
            ))):<div>Your friends have not posted</div>}

        </div>
    )
}

export default Post;