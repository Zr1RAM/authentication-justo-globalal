import { createContext, useEffect, useState } from "react";
import { makeRequests, useAxios } from "../customHooks/useMakeRequests";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    

    const login = async (credentials, callback = null) => {
        try {
            const response = await makeRequests("/auth/login", 'POST', credentials);
            const { id, username, isAdmin } = response.user.userInfo;
            setCurrentUser({ id, username, isAdmin });
        } catch (error) {
            console.error(error)
            callback(error);
        }

    }

    const logout = async () => {
        try {
            await makeRequests("/auth/logout", 'POST');
            // localStorage.removeItem("user");
            setCurrentUser(null);
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const loginWithLink = (userInfo) => {
        setCurrentUser(userInfo);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ login, currentUser, logout, loginWithLink }}>
            {children}
        </AuthContext.Provider>
    );

}