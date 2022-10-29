/* eslint-disable react-hooks/exhaustive-deps */
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const Post = () => {

    //Form state
    const [post, setPost] = useState({ description: "" });
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    const routeData = route.query;

    //Submit Post
    const submitPost = async (e) => {
        e.preventDefault();
        //Run checks for description
        if (!post.description) {
            toast.error("Description Field empty 😅", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        if (post.description.length > 300) {
            toast.error("Description too long 😅", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }

        if (post?.hasOwnProperty("id")) {
            const docRef = doc(db, "posts", post.id);
            const updatedPost = { ...post, timestamp: serverTimestamp() };
            await updateDoc(docRef, updatedPost);
            return route.push("/");
        } else {
            //Make a new post
            const collectionRef = collection(db, "posts");
            await addDoc(collectionRef, {
                ...post,
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                username: user.displayName,
            });
            setPost({ description: "" });
            toast.success("Post has been made 🚀", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return route.push("/");
        }
    };

    //Check our user
    const checkUser = async () => {
        if (loading) return;
        if (!user) route.push("/auth/login");
        if (routeData.id) {
            setPost({ description: routeData.description, id: routeData.id });
        }
    };

    useEffect(() => {
        checkUser();
    }, [user, loading]);

    return (
        <div className="container">
            {/* <h1>{data? data.description : "not available"}</h1> */}
            <div className='post__card'>
                <form
                    className='post__form'
                    onSubmit={submitPost}
                >
                    <h1>{post.hasOwnProperty("id") ? "Edit your post 📑" : "Create a new post ✍🏼"}</h1>
                    <div className="post__edit">
                        <h3>Description</h3>
                        <textarea
                            placeholder="Hai ! What's your creative thought 🚀"
                            value={post.description}
                            onChange={(e) => setPost({ ...post, description: e.target.value })}
                        ></textarea>
                        <p className={`p-normal ${post.description.length > 300 ? "p-exceeded" : ""}`}>
                            {post.description.length}/300
                        </p>
                    </div>
                    <button type="submit"> Submit </button>
                </form>
            </div>
        </div>
    )
}

export default Post