import React from "react";
import { Link } from "react-router-dom";
import "./assets/styles/index.css";
function App() {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold">Connectify</h1>
      <Link to="/Signup">Signup</Link>
      <Link to="/Signin">Signin</Link>
    </div>
  );
}

export default App;
