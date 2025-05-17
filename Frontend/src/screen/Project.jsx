import React,{useState,useEffect,useContext,useRef} from 'react'

import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import axios from '../config/axios.js'
import {initializeSocket,reciveMessage,sendMessage} from '../config/socket.js'
import { UserContext } from '../context/user.context.jsx';
import Markdown from 'markdown-to-jsx'
import { renderToStaticMarkup } from 'react-dom/server';
import "../CssFiles/project.css"
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; 


function Project() {
  const location=useLocation()
  
  const [slideOpen, setSlideOpen] = useState(false);
  const [userModal,setUserModal]=useState(false)
  const [selectedUserId,setSelectedUserId]=useState([])
  const [users,setUsers]=useState([])
  const [collaborators,setCollaborators]=useState([])
  const [message,setMessage]=useState('')
  const {user}=useContext(UserContext)
  const container = useRef(null);
  const Ai_container=useRef(null)

  
  
  const projectId=location.state._id

  const MessageSend=()=>{
     sendMessage('project-message',{
      message,
      sender:user
     })
    
     appendOutgoingMessage({message,sender:user}) 
     setMessage('')
  }
  const handleUser=(id)=>{
    setSelectedUserId((prev)=>
   prev.includes(id) ? prev.filter((uid)=> uid !== id) :[...prev,id]
   ) 
   
   }
  
  const addCollaborator=()=>{
     axios.put('/projects/add-user',{
      projectId:location.state._id,
      users:selectedUserId
     }).then((res)=>{
      setUserModal(false)
      setSelectedUserId([])
     }).catch((err)=>{
      console.log(err)
     })
  } 

  const appendIncomingMessage = (messageObject) => {
    const messageContainer = document.createElement('div');
    messageContainer.style.marginTop = '5px';
    messageContainer.style.padding = '3px';
    if(messageObject.sender?._id === 'ai'){
      messageContainer.style.width='320px';
      messageContainer.style.backgroundColor = '#000';
      messageContainer.style.color = 'white';

    }
    else{
      messageContainer.style.width='80%';
      messageContainer.style.backgroundColor = '#161616';
      messageContainer.style.color = 'white'; 
    }
   
    messageContainer.style.borderRadius = '3px';
    messageContainer.style.overflowY="auto";
  
    const small = document.createElement('small');
    small.textContent = messageObject.sender?.email || '';
    small.style.color = '#4c4d52';
  
    // 👇 Create the message content
    let messageText;
  
    if (messageObject.sender?._id === 'ai') {
      // Convert markdown string to HTML using markdown-to-jsx + renderToStaticMarkup
      const html = renderToStaticMarkup(
        <Markdown>{messageObject.message || 'No message'}</Markdown>
      );
      messageText = document.createElement('div');
      messageText.style.overflowY="auto";
      messageText.innerHTML = html;
    } else {
      messageText = document.createElement('p');
      messageText.textContent = messageObject.message || 'No message';
      messageText.style.fontSize = '12px';
     
    }
  
    messageContainer.appendChild(small);
    messageContainer.appendChild(messageText);
  
    if (container.current) {
      container.current.appendChild(messageContainer);
      container.current.scrollTop = container.current.scrollHeight;
    } else {
      console.warn("Container ref is null");
    }
  };
  const appendOutgoingMessage = (messageObject) => {
    const messageContainer = document.createElement('div');
    messageContainer.style.marginTop = '5px';
    messageContainer.style.marginLeft = 'auto';
    messageContainer.style.padding = '7px';
    messageContainer.style.width = '80%';
    messageContainer.style.backgroundColor = '#161616';
    messageContainer.style.borderRadius = '3px';
    
  
    const messageText = document.createElement('p');
    messageText.textContent = messageObject.message || 'No message';
    messageText.style.fontSize = '12px';
    messageText.style.textAlign='justify';

    messageText.style.color="#a4cfe4"
  
    const small = document.createElement('small');
    small.textContent = messageObject.sender?.email || '';
    small.style.color = '#5e5f63';
  
   
    messageContainer.appendChild(small);
    messageContainer.appendChild(messageText);
  
    // Use the ref instead of getElementById
    if (container.current) {
      container.current.appendChild(messageContainer);
      container.current.scrollTop = container.current.scrollHeight;
    } else {
      console.warn("Container ref is null");
    }
  };

  const AiIncomingMessage = (messageObject) => {
    const messageContainer = document.createElement('div');
    messageContainer.style.marginTop = '5px';
    messageContainer.style.padding = '10px';
    messageContainer.style.borderRadius = '8px';
    messageContainer.style.overflowY = 'auto';
    messageContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    messageContainer.style.marginBottom = '10px';
  
    if (messageObject.sender?._id === 'ai') {
      messageContainer.style.backgroundColor = '#000';
      messageContainer.style.color = 'white';
      messageContainer.style.width = '100%';
    } else {
      messageContainer.style.backgroundColor = 'lightpink';
      messageContainer.style.color = 'black';
      messageContainer.style.width = '80%';
      messageContainer.style.marginLeft = 'auto';
    }
  
    const small = document.createElement('small');
    small.textContent = messageObject.sender?.email || '';
    small.style.color = '#aaa';
    small.style.display = 'block';
    small.style.marginBottom = '5px';

    const time = document.createElement('h6');
    const now = new Date();
    time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    time.style.display = 'block';
    time.style.color = '#aaa';
    time.style.fontSize = '10px';
    time.style.marginTop = '4px';
    time.style.marginBottom = '10px';
  
    let messageText;
  
    if (messageObject.sender?._id === 'ai') {
      const html = renderToStaticMarkup(
        <Markdown>{messageObject.message || 'No message'}</Markdown>
      );
  
      messageText = document.createElement('div');
      messageText.classList.add('markdown-message');
      messageText.innerHTML = html;
  
      // Apply highlight.js to all <pre><code> blocks inside the message
      setTimeout(() => {
        messageText.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      }, 0);
    } else {
      messageText = document.createElement('p');
      messageText.textContent = messageObject.message || 'No message';
      messageText.style.fontSize = '14px';
      messageText.style.fontWeight = 'bold';
    }
  
    messageContainer.appendChild(small);
    messageContainer.appendChild(time)
    messageContainer.appendChild(messageText);
  
    if (Ai_container.current) {
      Ai_container.current.appendChild(messageContainer);
      Ai_container.current.scrollTop = Ai_container.current.scrollHeight;
    } else {
      console.warn("Container ref is null");
    }
   
  
  
   
  };
  




 
   

  
  
  
  
  
  
  useEffect(()=>{
       
      initializeSocket({projectId})
      reciveMessage('project-message', (data) => {
       
       if(data.sender?._id==="ai"){
        AiIncomingMessage(data)
       }
       else{
        appendIncomingMessage(data)
       }
    
      }) 
      
      

      axios.get('/users/all').then((res)=>{
        setUsers(res.data.users)
      })
      .catch((err)=>{
        console.log(err)
      })

      axios.get(`/projects/get-project/${location.state._id}`)
      .then(
        (res)=>{
          
          setCollaborators(res.data.project.users)
        }
      ).catch((err)=>{
        console.log(err)
      })
  },[])
  const handleCloseUser=()=>{
    setSelectedUserId([])
    setUserModal(false)
  }
 
 
 
  return (
    <>
       <ProjectContainer>
         <SlideDiv className={slideOpen ? 'active' : ''}>
            <SlideHeader>
              <h2>Collaborators</h2>
               <ClearIcon onClick={()=>setSlideOpen(false)}/>
            </SlideHeader>
            <Groups>
               
              {
                collaborators.map((colla)=>(
                  
                  <UserDiv >
                  <ImgDiv>
                     <AccountCircleIcon/>
                  </ImgDiv>
                  <p>{colla.email}</p>
                  </UserDiv>
                ))
              }
                
           
              
             
            </Groups>
         </SlideDiv>
         <ProjectLeft >
            <Header >
              <button onClick={()=>setUserModal(true)}>
                <AddIcon/>
                <p>Add collaborators</p>
              </button>
               <PeopleAltIcon onClick={()=>setSlideOpen(true)}/>
            </Header>
            <MessageArea ref={container}  >
                <MessageCreate >
                  <h6>Start collaborating! Use @ai followed by your prompt to generate ideas together.</h6>
                </MessageCreate>
               
                
            </MessageArea>
            <SendMessageBox>
                <input type="text" placeholder=" Enter message" value={message} 
                onChange={(e)=>setMessage(e.target.value)}/>
               <SendIcon onClick={MessageSend}/>
            </SendMessageBox>

         </ProjectLeft>
         <ProjectRight > 
          <RightHeader>
            <h3>AI RESPONSE</h3>
          </RightHeader>
          <AiDiv>
              <AiInner>
                 <h4>Need help? Just send a message starting with @ai.</h4>
              </AiInner>
            </AiDiv>
          <RightMiddle ref={Ai_container}>
            
          </RightMiddle>
         </ProjectRight>
         {
          userModal &&(
            <Usermodal>
                 <UserInner>
                     <ClearDiv>
                        <p>Users</p>
                        <ClearIcon  onClick={handleCloseUser}  style={{cursor:"pointer",color:'lightslategray'}}/>
                     </ClearDiv>
                     <hr/>
                     <AllUserDiv>
                         {
                          users.map((user)=>(
                            <UserDetails key={user._id} onClick={()=>handleUser(user._id)} 
                            style={{
                              backgroundColor: selectedUserId.includes(user._id) ? 'lightskyblue' : 'transparent',
                            }}
                            >
                              <AccountCircleIcon/>
                              <p>{user.email}</p>
                            </UserDetails>
                          ))
                         }
                      </AllUserDiv>
                      <AddButtonDiv>
                        <button onClick={addCollaborator}>Add Collaborator</button>
                      </AddButtonDiv>
                    
                  </UserInner>
            </Usermodal>
          )
         }

       </ProjectContainer>
    </>
  )
}


export default Project

const MessageCreate=styled.div`
  width:100%;
  margin-top:10px;
  margin-bottom: 10px;
  h6{
    text-align:center;
    color:#3b3b61;
  }
`
const AiInner=styled.div`
  width:auto;
  background-color:#2a3b3b;
  height:100%;
  display:flex;
  align-items:center;
   justify-content:center;  
   padding:10px;
   border-radius: 4px;
   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  h4{
    color:white;
    text-align:center;
    text-shadow: 2px 2px 2px black;
  }
`
const AiDiv=styled.div`
margin-top:60px;
width:100%;
display:flex;
align-items:center;
justify-content:center;
height:50px;

 
`
const RightMiddle=styled.div`
  width:100%;
  height:calc(100vh-110px);
  background-color:#151e1e;
 
  padding:10px;
  scroll-behavior:smooth;

 
`
const RightHeader=styled.div`
  width:100%;
  height:51px;
  position:fixed;
  background-color:#1f2e2e;
  
  h3{
    
    color:white;
    margin-left:40px;
    margin-top:15px;
  }
`
const AddButtonDiv=styled.div`
 flex:1;
 width:100%;
 overflow:hidden;
 display:flex;
 align-items:center;
 justify-content: center;


/* CSS */
button {
  align-items: center;
  appearance: none;
  background-color: #3EB2FD;
  background-image: linear-gradient(1deg, #4F58FD, #149BF3 99%);
  background-size: calc(100% + 20px) calc(100% + 20px);
  border-radius: 100px;
  border-width: 0;
  box-shadow: none;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-flex;
  font-family: CircularStd,sans-serif;
  font-size: 1rem;
  height: auto;
  justify-content: center;
  line-height: 1.5;
  padding: 6px 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: background-color .2s,background-position .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
}

button:active,
.button-21:focus {
  outline: none;
}

button:hover {
  background-position: -20px -20px;
}

button:focus:not(:active) {
  box-shadow: rgba(40, 170, 255, 0.25) 0 0 0 .125em;
}
 
`
const UserDetails=styled.div`
   border:none;
    width:100%;
    display:flex;
    align-items:center;
    gap:4px;
    min-height:40px;
    cursor:pointer;
    margin-bottom:3px;
    padding:2px;
    border-radius:2px;
    overflow:hidden;
    p{
      font-size:13px;
      font-weight:bold;
      color: #524e4e;
    }
    &:hover{
      background-color: lightblue;
    }

   
`
const AllUserDiv=styled.div`
   width:100%;
   flex:10;
   overflow-y:auto;
   display:flex;
   flex-direction:column;
   margin-bottom:20px;
  
   
`
const ClearDiv=styled.div`
  width:100%;
  flex:1;
  display:flex;
  align-items: center;
  justify-content: space-between;
  p{
    font-size: 20px;
    text-shadow:2px 2px 2px white;
    font-weight:bold;
    margin-left:20px;
    
  }
`
const UserInner=styled.div`
   width:300px;
   height:400px;
   background-color:white;
   padding:5px;
   box-sizing:border-box;
   display:flex;
   align-items:center;
   flex-direction: column;
   border-radius:5px;
   box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
`
const Usermodal=styled.div`
 width:100%;
 height:100%;
 display:flex;
 align-items:center;
 justify-content:center;
 position:fixed;
`
const UserDiv=styled.div`
 width:100%;
 height:40px;
 background-color: #bfdb9b;
 border-radius: 3px;
 padding:5px;
 display:flex;
 align-items: center;
 justify-content:flex-start;
 margin-top:2px;
 cursor:pointer;
 &:hover{
  background-color: #78a53e;
 }
 p{
  margin-left:5px;
  color:black;
  font-size:12px;
  text-shadow:2px 2px 2px white;
 }
  
`
const ImgDiv=styled.div`
   width:30px;
   height:30px;
   border-radius:50%;
   background-color:#292626;
   svg{
    width:100%;
    height:100%;
   }
`
const Groups=styled.div`
  width:100%;
  height:100%;
  overflow-y: auto;
  padding:5px;
  box-sizing: border-box;
  padding-bottom:60px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background:white;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #7aa2df;
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  
`
const SlideHeader=styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  height:50px;
  background-color:#979393;
  padding:5px;
  
  svg{
    margin-top:-10px;
    color:black;
    cursor:pointer;
  }
  h2{
    text-shadow:2px 2px 2px black;
    color: #fa0f5e;
  }
`

const SlideDiv = styled.div`
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100%;
  background-color: #2c2e3a;
  color: white;
  transition: left 0.3s ease;
  z-index: 2000; /* above everything */

  &.active {
    left: 0;
  }
`;

  



const SendMessageBox=styled.div`
   width:100%;
   flex:1;
   background-color:white;
   display:flex;
   align-items:center;
   justify-content:space-between;
   padding:5px;
   input{
    width:100%;
    margin-right:10px;
    height:100%;
    border:none;
    outline:none;
    padding:5px;
   }
   svg{
    cursor:pointer;
    color:lightslategray;
    &:hover{
        color:blue;
    }
   }
`

const MessageArea=styled.div`
   width:100%;
   flex:12;
   background-color:#000;
   padding:5px;
   overflow-y: auto;
   &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  scroll-behavior: smooth;
  
`
const Header=styled.div`
   width:100%;
   flex:1;
   display:flex;
   align-items:center;
   justify-content:space-between;
   background-color:#5a87e9;
   padding:5px;
   button{
    display:flex;
    gap:3px;
    align-items:center;
    background-color:#5a87e9;
    color:white;
    border:none;
    cursor:pointer;
    text-shadow:2px 2px 2px black;

   }
   button:hover{
    color:lightblue;
   }
   svg{
    cursor:pointer;
   }
`
const ProjectRight=styled.div`
  flex:5;
  background-color:#151e1e;
  overflow-y:auto;
  scroll-behavior: smooth;
  height:100%;
  @media screen and (min-width:900px) {
    flex:4;
  }
 
`
const ProjectLeft=styled.div`
    flex:3;
    @media screen and (min-width:900px) {
    flex:1.5
  }
 
  display:flex;
  flex-direction: column;
  box-sizing:border-box;
`

const ProjectContainer=styled.div`
   width:100%;
   height:100vh;
   overflow:hidden;
   display:flex;

`