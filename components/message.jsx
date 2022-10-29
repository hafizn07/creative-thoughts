export default function Message({ children, avatar, username, description }) {
    return (
        <div className="message__card">
            <div className="message__user">
                <img src={avatar} alt='' />
                <h4>{username}</h4>
            </div>
            <div className="message__desc">
                <p>{description}</p>
            </div>
            {children}
        </div>
    );
}