import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import PostCard from "../components/PostCard";
import axios from "axios";
function Profile() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = searchParams.get("userId");

        const response = await axios.get(
          "http://localhost:5000/api/user/userposts",
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.posts);
        setFriends(response.data.friends);
        setUser({ username: response.data.user.username });
        console.log(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);
  if (loading) {
    return <div>{loading}</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <div className="pl-[10vw] pt-[3vw] pr-[10vw] flex justify-around flex-col items-center">
        <div className="flex justify-around w-[60%] font-bold text-2xl  border-1 border-b border-white p-[1vw]">
          <div className="pfp w-[30vw] h-[30vw] lg:w-[20vw] lg:h-[20vw] xl:w-[15vw] xl:h-[15vw] relative">
            <div className="border-2 border-solid rounded-full border-white w-full h-full flex items-center justify-center">
              PFP
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="p-[1vw]">{user.username}</div>
            <div className="flex items-center space-x-4">
              <div className="p-[1vw]">{posts.length} Posts</div>
              <div className="p-[1vw]">{friends.length} Friends</div>
            </div>
          </div>
        </div>
        <div className="w-[70%] flex justify-around p-[1vw] font-bold text-2xl">
          Posts
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-items-center">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard post={post} />)
          ) : (
            <div className="   font-bold text-2xl col-span-3 row-span-10">
              This user has not posted...
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
