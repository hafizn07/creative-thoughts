import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { IoMdSend } from "react-icons/io"
import { arrayUnion, doc, getDoc, onSnapshot, orderBy, query, Timestamp, updateDoc, } from "firebase/firestore";

export default function Details() {
    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessages] = useState([]);

    //Submit a message
    const submitMessage = async () => {
        //Check if the user is logged
        if (!auth.currentUser) return router.push("/auth/login");

        if (!message) {
            console.log(message);
            toast.error("Don't leave an empty message 😅", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        const docRef = doc(db, "posts", routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });
        setMessage("");
    };

    //Get Comments
    const getComments = async () => {
        const docRef = doc(db, "posts", routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllMessages(snapshot.data().comments);
        });
        return unsubscribe;
    };

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    }, [router.isReady]);
    return (
        <div className="container">
            <Message {...routeData}></Message>
            <div className="comment__section">
                <div className="comments__area">
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        value={message}
                        placeholder="Send a message 😀"
                    />
                    <button onClick={submitMessage}>Send <IoMdSend /> </button>
                </div>
                <div className="comment__viewarea">
                    <h2 className="font-bold">Comments</h2>
                    {allMessage?.map((message) => (
                        <div className="comment__views" key={message.time}>
                            <div className="comment__info flex items-center gap-2 mb-4">
                                <img className="w-10 rounded-full" src={message.avatar} alt="" />
                                <h4>{message.userName}</h4>
                            </div>
                            <p>{message.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}