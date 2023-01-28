import React, { useState,useEffect } from "react";
import soketIO from "socket.io-client";
const Endpoint = 'http://localhost:5000'


function PostRestData() {
  let socket;
  const [name, setName] = useState("");
  const [isUsername,setUsername]=useState(false);
  const [msg,setMsg]=useState("")
  const [id,setId]=useState("")
  const send=(event)=>{
    event.preventDefault();
     socket=soketIO(Endpoint,{transports:['websocket']})
    console.log({message:msg,id:id});
    socket.emit("message",{message:msg,id:id})
    setMsg("")
  }
  useEffect(()=>{
    if(isUsername===true){
      socket=soketIO(Endpoint,{transports:['websocket']})
      socket.on("connection",()=>{
        setId(socket.id)
        console.log("connection Successful");
      })
      socket.emit('joined',{ name: name})
      socket.on('welcome',(data)=>{
        setId(socket.id)
        console.log(`${data.user}: Hello ${data.name},${data.message}`);
      })
      socket.on('userJoined',(data)=>{
        console.log(`${data.user}:${data.name},${data.message}`);
      })
      socket.on('leave',(data)=>{
          console.log(`${data.user}:${data.message}`);
      })
      return ()=>{
        
        socket.emit('disconnect');
        socket.off();
      }
    }
  },[socket,setUsername,isUsername])

  useEffect(()=>{
    if(isUsername===true){
    socket=soketIO(Endpoint,{transports:['websocket']})
    socket.on('sendmessage',(data)=>{
      console.log(data.user,data.message,data.id);
    })
    }
  },[socket,setUsername,isUsername])
  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim().length===0 || name==="" || name===null) {
      alert("Please insert valid username...!");
    }else{
      setUsername(true) 
    }
  }
  
  return (
    <div className="container p-4">
      <p className="h3 pb-3 text-success">
        {isUsername === false?" Message Clone for Group chat Please Insert Username...! ":" Let's Begin chat...!"}
      </p>
      {isUsername === true?<h5 className="text-danger">SignIn User :- <span className="text-info">{name}</span></h5>:null}
      {isUsername === true?<p>Connected Users : - 1 </p>:null}
        <div className="form-group">
          {isUsername === true?null:<form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input type="text" value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
              className="form-control" placeholder="Enter Username" aria-label="Enter username" aria-describedby="basic-addon2"/>
              <div className="input-group-append">
                <button  className="btn btn-danger">submit</button>
              </div>
            </div>
          </form>}
        <div className={isUsername ===  true?"d-inline":"d-none"}>
          <div className="messageBody mt-2 mb-2">
          </div>
            <form onSubmit={send}>
              <div className="input-group mb-3">
                    <textarea type="text" rows="1"  
                    className="form-control"  aria-label="Recipient's username" aria-describedby="basic-addon2"
                    value={msg}
                    onChange={(e)=>setMsg(e.target.value)}
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-danger">sent</button>
                    </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}

export default PostRestData;
