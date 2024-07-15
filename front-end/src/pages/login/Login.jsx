import { useContext, useState } from 'react'
import './login.scss'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState({error: null, errMsg: ""});

    const handleInput = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleLogin = (e) => {
        e.preventDefault();
        login(credentials, (err) => {
            setError({
                error: err,
                errMsg: "Incorrect username or password"
            })
        });
    }

    

  return (
    <div className='login'>
        <form>
            <div className="form">
                <input type="text" placeholder='username' name="username" onChange={handleInput}/>
                <input type="password" placeholder='password' name="password" onChange={handleInput}/>
                <button onClick={handleLogin}>Login</button>
                <Link to={"/generate"} state={{ username: credentials.username }}>
                    <button>Generate Link</button>
                </Link>
                <Link to={"/register"}>
                    <p>Not signed up?</p>
                </Link>
                {error && <p className='error-msg'>{error.errMsg}</p>}
            </div>
        </form>
    </div>
  )
}

export default Login