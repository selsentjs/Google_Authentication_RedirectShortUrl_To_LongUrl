
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Normal_SignIn_Authentication/Login';
import Register from './Normal_SignIn_Authentication/Register';

function App() {
  return (
    <div >
       
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
