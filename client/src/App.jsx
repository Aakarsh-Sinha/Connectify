import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
function App() {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold">Connectify</h1>
      <Link to='/Signup'>Signup</Link>
      <Link to='/Signin'>Signin</Link>
      <Link to='/Home'>Home</Link>
      <Link to='/Myfriends'>My friends</Link>
      <Link to='/Pendingrequests'>Pending Requests</Link>
      <Link to='/Personalprofile'>My Profile</Link>
      <Link to='/Profile'>Profile</Link>
      <Link to='/Sentrequests'>Sent requests</Link>
    </div>
  );
}

export default App;
