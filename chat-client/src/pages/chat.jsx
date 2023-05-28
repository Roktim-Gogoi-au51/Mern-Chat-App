import { useEffect, useState } from "react";
import store from "../store";
import Logo from '../assets/chappy.svg'
import { getUser } from "../actions";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Contacts from "../components/contacts";
import RoboContainer from "../components/RoboContainer";
import ChatContainer from "../components/chatContainer";

const Chat = () =>{
    const navigate = useNavigate();
    const [user,setUser] = useState([]);
    const [userSelected, setUserSelected] = useState(false)

    store.subscribe(()=>{
        const data = store.getState()
        setUser(data.user)
        setUserSelected(data.chatSelected)
    })

    useEffect(()=>{
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
        store.dispatch(getUser())
    },[])

    const logout = () => {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        navigate('/login')
    }

    return(
        <>
            <div className="chatContainer">
                <div className="chatHeader">
                    <div className='chatbrand'>
                        <img src={Logo} alt='Logo'/>
                        <h1>Chappy</h1>
                    </div>
                    <button onClick={logout}>LOGOUT</button>
                </div>
                <div className="container">
                   <div className="contactsContainer"><Contacts/></div> 
                   {!userSelected ? <RoboContainer prop={user}/> : <ChatContainer/>}
                </div>
            </div>
        </>
    )
} 

export default Chat;