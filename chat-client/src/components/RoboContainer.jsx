import { useEffect } from 'react';
import Robot from '../assets/Robot.png';

const RoboContainer = (prop) => {

    return(
        <>
        <div className='roboContainer'>
            <h1>Welcome {prop.prop.username}</h1>
            <h1>I am chappy</h1>
            <img className='Robot' src={Robot} alt='robot'/>
        </div>
        
        </>
    )
}

export default RoboContainer;