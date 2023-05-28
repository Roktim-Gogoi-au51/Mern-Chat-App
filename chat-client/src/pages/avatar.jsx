import { useState, useEffect } from "react";
import axios from 'axios';
import loader from '../assets/loader.gif';
import jwt from 'jwt-decode';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AvatarPg = () => {
  const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
     }; 
  const [user,setUser] = useState({});
  const [avatarDataUri, setAvatarDataUri] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    const jwtToken = localStorage.getItem("token")
    if(!jwtToken){
      navigate('/login')
    }
    const decodedToken = jwt(jwtToken)
    setUser({username: decodedToken.username})
    console.log('decodedtoken:',decodedToken)
    if(decodedToken.isAvatar){
      navigate('/chat')
    }
    const fetchAvatars = async () => {
      try {
        const avatarPromises = [];
        for(let i=0; i<4; i++){
          avatarPromises.push(
            axios.get(`https://api.multiavatar.com/${Math.round(Math.random() * 1000)}?apikey=mjQTo0qZLdxkrY`)
              .then(svg => {
                const svgDataUri = `data:image/svg+xml;base64,${btoa(svg.data)}`;
                return svgDataUri;
              })
          )
        }
        const avatarDataUris = await Promise.all(avatarPromises);
        setAvatarDataUri(avatarDataUris);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.post(`http://localhost:3000/avatar/${user.username}`,
          {
            payload: {
              avatar: `${avatarDataUri[selectedAvatar]}`,
              isAvatar: true
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        if (data.status) {
          // store.dispatch({ type: "SET_AVATAR", payload: { avatar: `${avatarDataUri[selectedAvatar]}` } });
          // store.dispatch({ type: "SET_USER", payload: { user: user } });
          navigate('/chat');
        } else {
          toast.error(data.message, toastOptions);
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Unable to set profile picture, please try again later.", toastOptions);
      }
    }
  }
  
  useEffect(()=>{
    console.log(avatarDataUri)
  })


  return (
    <>
      {isLoaded ? (
        <div className="avatarContainer">
            <div className="title">
                <h1>Hello {user.username}!</h1>
                <h1>select your avatar</h1>
            </div>
          <div className="avatars">
            {avatarDataUri.map((avatar, index) => (
            <div
            className={`avatar ${
              selectedAvatar === index ? "selected" : ""
            }`}
            >
              <img src={avatar} alt={`Avatar ${index}`} key={`Avatar-${index}`} onClick={() => setSelectedAvatar(index)} />
            </div>
            ))}
          </div>
          <button onClick={()=>setProfilePicture()} className="setDP">Set as profile picture</button>
        </div>
      ) : (
        <div className="avatarContainer">
          <img src={loader} alt="loader" className="loader" />
        </div>
      )}
      <ToastContainer/>
    </>
  );
}

export default AvatarPg;
