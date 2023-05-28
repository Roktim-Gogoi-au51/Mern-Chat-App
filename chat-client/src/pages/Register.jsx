import { useState } from 'react';
import Logo from '../assets/chappy.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
   const navigate = useNavigate();
   const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
   };
   const [input, setInput] = useState({
      name: '',
      username: '',
      email: '',
      password: '',
   });
   const [ formErrors, setFormErrors] = useState({});

   const handleSubmit =async(e) => {
      e.preventDefault()
      setFormErrors(validate(input))
      const{data} = await axios.post('http://localhost:3000/register', input);
      console.log(data)
      if (data.status === false) {
         toast.error(data.message, toastOptions);
      }
      if (data.status === true) {
            navigate("/login");
       }
   }

   const handleInput = (e) => {
      setInput({...input,[e.target.name]: e.target.value});
   }

   const validate = (values) => {
      const errors = {};
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      if(!values.name){
         errors.name = "Name is required!"
      }
      if(!values.username){
         errors.username = "Username is required!"
      }

      if(!values.email){
         errors.email = "Email is required!"
      }else if (!regex.test(values.email)) {
         errors.email = "This is not a valid email format!";
      }
      if(!values.password){
         errors.password = "Password is required!"
      }else if (values.password.length < 4) {
         errors.password = "Password must be more than 4 characters";
      }
      return errors;
   }

      return(
      <>
         <div className='formcontainer'>
            <form onSubmit={handleSubmit}>
               <div className='brand'>
                  <img src={Logo} alt='Logo'/>
                  <h1>Chappy</h1>
               </div>
               <input type='text' placeholder='Fullname' name='name' onChange={handleInput}/>
               <p className='formErrors'>{formErrors.name}</p>
               <input type='text' placeholder='Username' name='username' onChange={handleInput}/>
               <p className='formErrors'>{formErrors.username}</p>
               <input type='text' placeholder='Email' name='email' onChange={handleInput}/>
               <p className='formErrors'>{formErrors.email}</p>
               <input type='password' placeholder='Password' name='password' onChange={handleInput}/>
               <p className='formErrors'>{formErrors.password}</p>
               <button type='submit'>Create account</button>
               <span className='goToLogin'>
               Already have an account ? <Link to="/login">Login.</Link>
            </span>
            </form>
         </div>
         <ToastContainer />
      </>
      ) 
}

export default Register;