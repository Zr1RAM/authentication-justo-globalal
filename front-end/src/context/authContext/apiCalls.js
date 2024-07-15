import { signInWithEmailAndPassword } from "firebase/auth";
import { makeRequest } from "../../axios";
import { auth } from "../../firebase";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async(credentials, dispatch) => {
    dispatch(loginStart());
    try {
        const res = await makeRequest.post("/auth/login", credentials);
        // console.log(res.data);
        const user = await firebaseLogin(credentials);
        console.log(user);
        res.data.userInfo.isAdmin && dispatch(loginSuccess(res.data.userInfo));
    } catch (error) {
        console.log(error);
        dispatch(loginFailure(error));
    }
};

export const firebaseLogin = async (credentials) => {
    // console.log(credentials);
    const { email, password } = credentials;
    // try {
    //     const userCredential = await auth.signInWIthEmailAndPassword(email, password);
    //     console.log(userCredential.user);
    //     return userCredential.user;
    // } catch (error) {
    //     console.error("Firebase sign in error:",error);
    //     throw error;
    // }
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .catch((error) => {
            console.error("Firebase sign in error:",error);
            throw error;
        });
};
