import { useState, useEffect, useRef } from "react";
import store from "../store";
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
import axios from 'axios';
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:3000"

const ChatContainer = () => {
    const socket = useRef();
    const messageContainerRef = useRef(null);
    const [user, setUser] = useState({});
    const [chatUser, setChatUser] = useState({});
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    store.subscribe(() => {
            const data = store.getState();
            setUser(data.user);
            setChatUser(data.chat)
            setMessages(data.messages)
    });

    useEffect(() => {
        setValue(''); 
        setShowEmojiPicker(false);
      }, [chatUser]);

    useEffect(()=>{
        if(user._id){
            socket.current = io(ENDPOINT)
            socket.current.emit("add-user", user._id)
        }
    },[user])

    useEffect(()=>{
        axios.post('http://localhost:3000/getMessages',{from:user.username,to:chatUser.username},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }).then(res=>{
            store.dispatch({type:'SET_MESSAGES', payload:res.data})
        })
    },[user,chatUser])

    useEffect(()=>{
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
    },[messages])

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emoji) => {
        setValue((prevValue) => prevValue + emoji.emoji);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/addMessage',{from:user.username,to:chatUser.username,message:value},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })

        socket.current.emit('send-msg', {
            from: user._id,
            to: chatUser._id,
            message:value
        })

        const msgs = [...messages];
        msgs.push({fromSelf:true, message:value})
        setMessages(msgs)

        setValue('')
    }

    useEffect(() => {
        if (socket.current) {
          socket.current.on("msg-recieve", (msg) => {
            console.log(msg)
            setArrivalMessage({ fromSelf: false, message: msg });
          });
        }
      });

    useEffect(()=>{
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    },[arrivalMessage])


    return(
        <>
        {Object.keys(user).length !== 0 && (
            <>
                <div className="Chat-Container">
                    <div className="chat-header">
                        <div className="userAvatar">
                        <img src={chatUser.avaterImage} alt=""/>
                        </div>
                        <div className="username">
                            <h3>{chatUser.username}</h3>
                        </div>
                    </div>
                    <div className="messageContainer" ref={messageContainerRef}>
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
                    </div>
                    <div className="inputContainer">
                        <div className="button-container">
                            <div className="emoji">
                                <BsEmojiSmileFill onClick={handleEmojiPickerhideShow}/>
                                {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                            </div>
                        </div>
                        <form className="input-container" onSubmit={handleSubmit}>
                            <input type='text' placeholder="type your message here" value={value} onChange={(e)=>{setValue(e.target.value)}}/>
                            <button className="submit" type="submit">
                                <IoMdSend/>
                            </button>
                        </form>
                    </div>
                </div>
            </>
            ) }
        </>
    )
}

export default ChatContainer;