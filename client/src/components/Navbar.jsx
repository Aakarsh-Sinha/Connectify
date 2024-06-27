import React from 'react'

function Navbar(){
    return <>
        <div className='h-[10vh] w-full flex justify-between items-center p-[2.5vw]'>
            <div className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-purple p-4 bg-clip-text text-transparent">Connectify</div>
            <div>Posts</div>
            <div>Sign-out</div>
        </div>
    </>
}

export default Navbar;