
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Normal_SignIn_Authentication/Login';
import Register from './Normal_SignIn_Authentication/Register';
import AnalyseShortUrlAndUserDetails from './ShortUrl/AnalyseShortUrlAndUserDetails';


function App() {
  return (
    <div >
       
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<AnalyseShortUrlAndUserDetails />}/>
    
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
