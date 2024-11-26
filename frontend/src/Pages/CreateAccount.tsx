

import { RedirectLoginOptions, useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Extend RedirectLoginOptions to include screen_hint
interface CustomRedirectLoginOptions extends RedirectLoginOptions {
    screen_hint?: string;
}

const CreateAccount: React.FC = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/MakeAccount"); // Redirect logged-in users to the home page
        }
    }, [isAuthenticated, navigate]);

    const handleSignUp = () => {
        // Use the extended interface to include screen_hint
        // const options: CustomRedirectLoginOptions = {
        //     screen_hint: "signup", // Force the signup screen
        //     openUrl: "login", // Forces the login/signup flow regardless of session
        //     redirect_uri: `${window.location.origin}/findgame`, // Redirect after signup
        // };
        loginWithRedirect(); // Pass the custom options
    };



    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                <h1 className="text-2xl font-semibold mb-4">Create an Account</h1>
                <p className="text-gray-600 mb-6">Sign up to join Omada Gaming Center.</p>
                <button
                    onClick={handleSignUp}
                    className="bg-green px-6 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                    signup
                </button>
            </div>
        </div>
    );
};

export default CreateAccount;

