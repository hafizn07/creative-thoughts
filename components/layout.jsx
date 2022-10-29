import NavBar from "./NavBar";

export default function Layout({ children }) {
    return (
        <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
            <NavBar />
            <main>{children}</main>
        </div>
    );
}