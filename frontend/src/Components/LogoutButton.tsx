import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = ({ className = "" }) => {
    const { logout, user } = useAuth0();

    return (
        <>
            <h1> {user?.email}</h1>
            <button
                className={`flex justify-center align-middle ${className}`}
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>

                Sign Out
            </button>
        </>
    );
};

export default LogoutButton;
