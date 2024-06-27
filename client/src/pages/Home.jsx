import React from 'react';
import Navbar from '../components/Navbar';
import '../black.css'
import Sidebar from '../components/Sidebar';
import Addfriend from '../components/Addfriend'
import Post from '../components/Post'
import Sentrequests from '../components/Sentrequests'
import Pendingrequests from '../components/Pendingrequests'
import Myfriends from '../components/Myfriends'
import { useState } from 'react';

function Home(){
    const [active,setActive]=useState("home");
    let ActiveComponent;
    switch (active) {
      case 'Home':
        ActiveComponent = Post;
        break;
      case 'Add Friends':
        ActiveComponent = Addfriend;
        break;
      case 'Send Request':
        ActiveComponent = Sentrequests;
        break;
      case 'Pending Requests':
        ActiveComponent = Pendingrequests;
        break;
      case 'My Friends':
        ActiveComponent = Myfriends;
        break;
      default:
        ActiveComponent = Post;
    }
    return <>
       <Navbar/>
       <div className="flex w-[100vw]">
            <Sidebar setActive={setActive}/>
            <div className="p-[1vw] w-[100vw]">
                <ActiveComponent/>
            </div>
       </div>

    </>
}

export default Home;