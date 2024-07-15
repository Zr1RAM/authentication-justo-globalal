import { useContext } from 'react';
import './app.scss';
import Home from "./pages/home/Home";
import GenerateLink from './pages/linkGenerate/GenerateLink';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { AuthContext } from './context/authContext';

function App() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" exact 
          element={
            currentUser ? <Home /> : <Navigate to={"/login"}/>
          } 
        />
        <Route path="/login" 
          element={
            !currentUser ? <Login /> : <Navigate to={"/"}/>
          } 
        />
        <Route path="/register" 
          element={
            !currentUser ? <Register /> : <Navigate to={"/"}/>
          } 
        />
        <Route path="/generate" 
          element={
            !currentUser ? <GenerateLink /> : <Navigate to={"/"}/>
          } 
        />
        <Route path="/verify-link" 
          element={
            !currentUser ? <GenerateLink /> : <Navigate to={"/"}/>
          } 
        />
        
      </Routes>
    </Router>
  );

}

export default App;
