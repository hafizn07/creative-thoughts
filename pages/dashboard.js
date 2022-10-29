import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where, } from "firebase/firestore";
import Message from "../components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

const Dashboard = () => {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    // See if the user is logged in 
    const getData = async () => {
        if (loading) return;
        if (!user) return route.push("/auth/login");

        const collectionRef = collection(db, "posts");
        const q = query(collectionRef, where("user", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsubscribe;
    };

    //Delete Post
    const deletePost = async (id) => {
        const docRef = doc(db, "posts", id);
        await deleteDoc(docRef);
    };

    //Get users data
    useEffect(() => {
        getData();
    }, [user, loading]);

    return (
        <div className='container'>
            <h1>Your Posts</h1>
            <div>
                {posts.map((post) => {
                    return (
                        <Message {...post} key={post.id}>
                            <div className="post__btngroup flex gap-4">
                                <button
                                    onClick={() => deletePost(post.id)}
                                    className="deletebtn"
                                >
                                    <BsTrash2Fill className="text-2xl" /> Delete
                                </button>
                                <Link href={{ pathname: "/post", query: post }}>
                                    <button className="editbtn">
                                        <AiFillEdit className="text-2xl" />
                                        Edit
                                    </button>
                                </Link>
                            </div>
                        </Message>
                    );
                })}
                <button className="signout-btn" onClick={() => auth.signOut()}>
                    <FaSignOutAlt />Sign out
                </button>
            </div>
        </div>
    )
}

export default Dashboard