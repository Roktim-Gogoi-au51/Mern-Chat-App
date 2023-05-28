import axios from 'axios';
import jwt from 'jwt-decode';

export const getUser = () => {
    const user = jwt(localStorage.getItem('token'))
    const username = user.username
    return function(dispatch){
        axios.get(`http://localhost:3000/user/${username}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }).then(res=>dispatch({
            type: 'SET_USER',
            payload: res.data
        }))
    }
}

export const getContacts = () => {
    const user = jwt(localStorage.getItem('token'))
    const username = user.username
    return function(dispatch){
        axios.get(`http://localhost:3000/getContacts/${username}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }).then(res=>dispatch({
            type: 'SET_CONTACTS',
            payload: res.data
        }))
    }
}