import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

const Login = () => {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    //Sign in with google
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            route.push("/");
        } else {
            console.log("login");
        }
    }, [route, user]);


    return (
        <div className="login__container">
            <div className='login__card'>
                <h3 className="join__head">Join Today 🚀</h3>
                <div className="join__desc">
                    <h3>Sign in with one of the providers</h3>
                    <button onClick={GoogleLogin}>
                        <FcGoogle className="google-logo" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login