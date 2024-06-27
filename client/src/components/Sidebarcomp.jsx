import React from'react';

function Sidebarcomp({title,setActive,icon}){
    return(
    <div className="flex justify-between items-center p-[1.7vw] "onClick={()=>setActive(title)}>
        <div className="w-[15%]">{icon}</div>
        <div className="w-[85%] justify-start">{title}</div>
    </div>
    )
}

export default Sidebarcomp;