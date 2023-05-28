import {Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AvatarPg from './pages/avatar';
import Chat from './pages/chat';
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path='/' element={<Register/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/avatar' element={<AvatarPg/>}/>
      <Route path='/chat' element={<Chat/>}/>

    </Routes>
  );
}

export default App;
