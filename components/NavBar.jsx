/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function NavBar() {
    const [user, loading] = useAuthState(auth);
    return (
        <nav className='navbar'>
            <div className='nav__head'>
                <Link href="/">Creative Thoughts</Link>
            </div>
            <div className='nav__join'>
                {!user && (
                    <Link href="/auth/login">
                        <button>Join Now</button>
                    </Link>
                )}
                {user && (
                    <div className='nav__login'>
                        <Link href="/post">
                            <button>Post</button>
                        </Link>
                        <Link href="/dashboard">
                            <img src={user.photoURL} alt={user.displayName} />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}