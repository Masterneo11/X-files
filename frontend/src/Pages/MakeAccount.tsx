import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const MakeAccount: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isAuthenticated && user?.email) {
            // Check if the modal has been completed for this user
            const modalCompleted = localStorage.getItem(`modalCompleted-${user.email}`);
            if (!modalCompleted) {
                setIsModalOpen(true); // Show modal if not completed
            }
        }
    }, [isAuthenticated, user]);


    const handleDataSubmit = (name: string, userName: string) => {
        if (user?.email) {
            // Save data for this user (replace with API call if needed)
            const userData = { email: user.email, name, userName };
            console.log("User Data Saved:", userData);

            // Persist data in localStorage as a fallback
            localStorage.setItem(`userData-${user.email}`, JSON.stringify(userData));
        }
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome to the App</h1>
            {isAuthenticated && user ? (
                <p>Logged in as: {user.email}</p>
            ) : (
                <p>Please log in.</p>
            )}

        </div>
    );
};

export default MakeAccount;
