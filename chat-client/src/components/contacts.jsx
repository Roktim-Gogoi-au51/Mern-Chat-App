import { useState, useEffect } from "react";
import store from '../store';
import { getContacts } from "../actions";


const Contacts = () =>{
    const [users,setUsers] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    store.subscribe(()=>{
        const data = store.getState()
        setUsers(data.contacts)
    })

    useEffect(()=>{
        store.dispatch(getContacts())
    },[])

    const currentChat = (index, contact) => {
        store.dispatch({type: 'SET_CHAT', payload: contact})
        store.dispatch({type: 'SET_CHATSELECTED'})
        setCurrentSelected(index)
    }

    return(
        <>
          {users.length && users.map((contact,index)=>{
            return(
                <div className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`} 
                  key={contact._id} 
                  onClick={()=>currentChat(index,contact)}>
                    <img className="userAvatar" src={contact.avaterImage} alt="avatar" key={`${index}`}/>
                    <span>
                        {contact.username}
                    </span>
                </div>
            )
          })}
        </>
    )
}

export default Contacts;