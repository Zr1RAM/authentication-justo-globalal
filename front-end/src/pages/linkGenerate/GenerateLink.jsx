import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { makeRequests } from '../../customHooks/useMakeRequests';
import { AuthContext } from '../../context/authContext';

const GenerateLink = () => {
    const location = useLocation();
    const username = location.state?.username;
    const [oneTimeLink, setOneTimeLink] = useState("");
    const { loginWithLink } = useContext(AuthContext);

    useEffect(() => {

      const getOneTimeLink = async (username) => {
        try {
          const response = await makeRequests("/auth/generate-link", "POST", {username});
          // console.log(response.link);
          setOneTimeLink(response.link);
        } catch (error) {
          console.error(error);
        }
      }

      if(username !== "") {
        getOneTimeLink(username);
      }
    }, [username]);

    const verifyLink = async () => {
      try {
        console.log(`/auth/verify-link/${oneTimeLink}`);
        const response = await makeRequests(`/auth/verify-link/${oneTimeLink}`);
        console.log(response.user);
        loginWithLink(response.user);
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <div>
      <p>{username === "" ? "no email" : username}</p>
      {oneTimeLink !== "" && <button onClick={verifyLink}>Verify</button>}
    </div>
  )
}

export default GenerateLink