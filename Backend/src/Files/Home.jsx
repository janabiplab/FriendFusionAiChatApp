import React ,{useContext,useState,useEffect} from 'react'
import {UserContext} from "../context/user.context"
import styled from "styled-components"
import AddIcon from '@mui/icons-material/Add';
import { useNavigate ,Link} from 'react-router-dom';
import axios from "../config/axios.js"
import PersonAddIcon from '@mui/icons-material/Person';
import ClearIcon from '@mui/icons-material/Clear';
import chatbot from '../assets/chatbot3.png'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';



function Home() {
  const {user}=useContext(UserContext)

  const [projectName,setProjectName]=useState("")
  const [isModalOpen,setIsModalOpen]=useState(false)

  const [project,setProject]=useState([])

  const navigate=useNavigate()
  const logout = () => {
    axios.get('/users/logout')
      .then((res) => {
        alert(res.data.message) // Logged out successfully
        // Clean up
        localStorage.removeItem('token');
        localStorage.clear()
      
        // Redirect to login page
        navigate('/login')
      })
      .catch((err) => {
        console.error('Logout failed:', err.response?.data || err.message);
      });
  };
  
 
  const getProjects = () => {
    axios.get('/projects/all')
      .then((res) => {
        setProject(res.data.projects);
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  useEffect(() => {
    getProjects();
  }, []);
  
  const createProject = (e) => {
    e.preventDefault();
    axios.post('/projects/create', { name: projectName })
      .then(() => {
        setIsModalOpen(false);
        getProjects(); // ✅ refresh list
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  return (
      
    <>
       <HomeContainer>
        <ProjectButtonDiv>
        <ButtonInnerDiv>
        <ProjectButton onClick={()=>setIsModalOpen(true)}>
          Create Project
          <AddIcon />
        </ProjectButton>
        
        <NavbarDiv>
             <Link to="/login" style={{display:"flex", flexDirection:"column" ,textDecoration:'none',color:'white'}}><LoginIcon/><p>login</p></Link>
             <Link onClick={logout} style={{display:"flex", flexDirection:"column" ,textDecoration:'none',color:'white'}}><LogoutIcon/><p>logout</p></Link>
        </NavbarDiv>
        </ButtonInnerDiv>
        </ProjectButtonDiv>
        <ProjectMainCon>
        <PNameCon>
            <h3>Projects</h3>
        </PNameCon>
         <AllProjectsContainer>
          
          
           {project.map((pro)=>(
            <Pcontainer key={pro._id} onClick={()=>navigate('/project',{state:pro})}>
               <p>{pro.name}</p>
               <Collaborate>
                   <PersonAddIcon/>
                   <small>collaborators:{pro.users.length}</small>

               </Collaborate>
            </Pcontainer>
           ))}
          
         </AllProjectsContainer>
         </ProjectMainCon>
        
        {isModalOpen && (
             <ProjectCreateCon>
             <PInnerContainer>
                <CDiv>
                <h3>Create New Project</h3>
                <ClearIcon onClick={()=>setIsModalOpen(false)} />
                </CDiv>
                <br/><br/>
                <form onSubmit={createProject}>
                  <label>Project Name</label>
                  <br/><br/>
                  <input 
                  placeholder="Enter the project name" 
                  type="text"
                  value={projectName}
                  onChange={(e)=>setProjectName(e.target.value)}
                   />
                  
                    
                  <button type="submit" > create</button>
                  
                </form>
  
          </PInnerContainer>
              
          </ProjectCreateCon>
       )}
     
            
          
       </HomeContainer>
      
      
  </>    
        
  )
}

export default Home
const ProjectMainCon=styled.div`
       flex:5;
       height:100vh;
       padding-bottom: 70px;
      
`
const PNameCon=styled.div`
  width:100%;
  height:70px;
 
  display:flex;
  align-items: center;
  justify-content: center;
  box-sizing:border-box;
 
  background-color:#009999;

 
  border:1px solid lightblue;
 h3{
  margin:0;
  color:white;
  font-family: "Archivo Black", sans-serif;
 }
`
const Collaborate=styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:lightslategray;
  margin-top:10px;
`

const Pcontainer=styled.div`
    width:300px;
    height:auto;
    border-radius: 5px;
    border:1px solid lightslategray;
    margin-bottom:18px;
    padding:10px;
    background-color: #172027;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    &:hover{
      background-color: #293a46;
      cursor: pointer;
    }
    p{
      font-weight:bold;
      color:#e7dfdf;
      font-family: "Archivo Black", sans-serif;
      font-weight: 400;
      font-style: normal;
    }
`
const AllProjectsContainer=styled.div`

   padding:10px;
   width:100%;
   overflow-y: auto;
   height:100%;
   overflow-x:hidden;
   
    
`
const CDiv=styled.div`
    display:flex;
    align-items:center;
    justify-content: space-between;
    svg{
      color:white;
      cursor:pointer;
    }
    h3{
    
    color:white;
    text-shadow:2px 2px 2px black;
    
   }
`

const PInnerContainer=styled.div`
   width:300px;
   height:auto;
   margin-bottom:20px;
   background-color:#323338;
   border-radius:5px;
   box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
   padding:10px;
   button{
    padding:3px 5px;
    border-radius:3px;
    cursor:pointer;
    margin-top:20px;
    font-size:17px;
    border:none;
    background-color: #3f3ff0;
    color:white;
   

   }
   button:hover{
      background-color:#4c526e;
      border:1px white;
      
    }
  
   label{
    
    color:lightblue;
    font-size:15px;
    text-shadow:2px 2px 2px black;
    font-weight:bold;
   }
   input{
    width:100%;
    font-size:15px;
    padding:8px;
    border-radius:5px;
    outline:none;
    border:none;
   }
`
const ProjectCreateCon=styled.div`
  width:100%;
  height:100%;
  position:fixed;
  display:flex;
  align-items:center;
  justify-content:center;
`
const ButtonInnerDiv=styled.div`
  width:100%;
  height:70px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  background-color:#009999;
  border:1px solid lightskyblue;
 
  gap:5px;
  
 
`
const NavbarDiv=styled.div`
   height:50px;
   
   min-width:200px;
   display:flex;
   align-items:center;
   justify-content: space-between;
   margin-right:30px;
   
   svg{
    font-size:30px;
   }
   
`
const ProjectButtonDiv=styled.div`
  flex:11;
 
  
 
`
const ProjectButton=styled.button`
display:flex;


align-items: center;
justify-content: center;
padding:5px;
cursor:pointer;
background-color:#172027;
border:none;
border-radius:5px;
color:white;
height:50px;
max-width:150px;
margin-left:10px;
border:1px solid lightseagreen

    
`
const HomeContainer=styled.div`
    width:100%;
    height:100Vh;
    overflow:hidden;
  
    display:flex;
    box-sizing:border-box;
    background-image: url(${chatbot});
    background-repeat: no-repeat;
    background-size: cover;
`