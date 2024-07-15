import '../login/login.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { makeRequests } from '../../customHooks/useMakeRequests';

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [message, setMessage] = useState({ msg: "", color: "" });

    const handleInput = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await makeRequests("/auth/register", "POST", credentials)
            setMessage({
                msg: "Registration success",
                color: "green"
            });
        } catch (error) {
            console.error(error);
            setMessage({
                msg: "User already exists",
                color: "red"
            });
        }
    }

  return (
    <div className='login'>
        <form>
            <div className="form">
            <input type="text" placeholder='username' name="username" onChange={handleInput}/>
                <input type="password" placeholder='password' name="password" onChange={handleInput}/>
                <button onClick={handleLogin}>Register</button>
                <Link to={"/login"}>
                    <p>Already a member?</p>
                </Link>
                {message.msg !== "" && <p style={{ color: `${message.color}` }}>{message.msg}</p>}
            </div>
        </form>
    </div>
  )
}

export default Register