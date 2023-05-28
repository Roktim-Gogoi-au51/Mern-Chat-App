import { useState, useEffect } from "react";
import store from "../store";

const MessageContainer = () => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});

    store.subscribe(()=>{
        const data = store.getState()
        setMessages(data.messages)
        setUser(data.user)
    })

    useEffect(()=>{
        console.log(messages)
    },[messages])

    

    return (
        <>
        <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </>
    )
}

export default MessageContainer;