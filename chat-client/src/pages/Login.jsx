import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/chappy.svg'
import { useState} from 'react';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
   const navigate = useNavigate();
   const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
   };
   const [values, setValues] = useState({
      email:"",
      password:"",
   })

   const handleSubmit = async(e) => {
      e.preventDefault();
      const{data} = await axios.post('http://localhost:3000/login', values);
      if (data.status === false) {
         toast.error(data.message, toastOptions);
      }
      if (data.status === true) {
            localStorage.setItem('token', data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            navigate("/avatar");
       }

   }

   const handleChange = (e) => {
      setValues({...values, [e.target.name]: e.target.value})
   }

    return(
     <>
        <div className='formcontainer'>
         <form className='loginForm' onSubmit={handleSubmit}>
            <div className='brand'>
               <img src={Logo} alt='Logo'/>
               <h1>Chappy</h1>
            </div>
            
            <input type='text' placeholder='Email' name='email' onChange={handleChange}/>

            <input type='password' placeholder='Password' name='password' onChange={handleChange}/>
            
            <button type='submit'>Login</button>
            <span>
               Create an account ? <Link to='/'>Register</Link>
            </span>
         </form>
      </div>
      <ToastContainer />
     </>
    ) 
 }
 
 export default Login;