import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DiceIcon from "../assets/dice-d20.svg";
import PodiumIcon from "../assets/podium-victory-leader.svg";
import Modal from "../Components/Modal";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000"; // Backend URL

interface Event {
    id: string;
    event_title: string;
    location: string;
    start_time: string;
    end_time: string;
    description?: string;
    max_players: number;
    user_id: number;
    event_owner: string;
    latitude: number;
    longitude: number;
    month: string;
    creator: string;
}

interface CreateUser {
    id?: number; // Added to get `user_id`
    name: string;
    username: string;
    email: string;
    photo?: string | null;

}
interface Creator {
    name: string,
    username: string;
}

const Home: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<CreateUser | null>(null);
    const navigate = useNavigate(); // Hook for navigation

    // Check if the user exists in the database by email
    const checkUser = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const user = await response.json();
                setUserInfo(user);
                setIsModalOpen(false);
            } else {
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error checking user:", error);
            setIsModalOpen(true);
        }
    };

    // Fetch events for the logged-in user
    const fetchUserEvents = async (userId: number) => {
        try {
            // const response = await fetch(`http://localhost:8000/events/users/1/events`, {

            const response = await fetch(`${API_BASE_URL}/events/users/${userId}/events`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching user-specific events:", error);
        }
    };

    // Create a new user in the database
    const createUser = async (userData: CreateUser) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const createdUser = await response.json();
                setUserInfo(createdUser);
                setIsModalOpen(false);
            } else {
                console.error("Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Handle modal form submission
    const handleModalSubmit = (name: string, username: string) => {
        if (!user || !user.email) return;
        const userData: CreateUser = { name, username, email: user.email, photo: user.picture || null };
        createUser(userData);
    };

    // Fetch user info and events on component mount
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            checkUser(user.email);
        }
    }, [isAuthenticated, user]);

    // Fetch events once `userInfo` is available
    useEffect(() => {
        if (userInfo?.id) {
            fetchUserEvents(userInfo.id); // Pass the user ID to fetch user-specific events
        }
    }, [userInfo]);

    return (
        <>
            <div className="container w-full mt-6 flex flex-col items-center vw-90">
                <h1 className="text-xl font-bold mb-4">Home</h1>

                {userInfo ? (
                    <div className="user-info mb-4">
                        <p>Welcome {userInfo.username}</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}

                {/* Grid layout for event boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl ">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border-2 border-gray-600 shadow-md rounded-lg flex flex-col justify-between"
                        >
                            {/* Title and icon */}
                            <div className="flex items-center mb-2">
                                <img className="h-5 w-5 z-10" src={DiceIcon} alt="dice" />
                                <div className="text-green-700 ml-5 text-lg font-medium">{event.event_title}</div>
                            </div>

                            {/* Event details */}
                            <p className="text-sm text-gray-600">{event.month}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center space-x-4">
                                    <img className="h-5 w-5" src={PodiumIcon} alt="podium" />
                                    <div>
                                        {Object.entries(event.creator || {})
                                            .filter(([key]) => key === "username") // Filter for only the 'username' key
                                            .map(([_, value]) => (
                                                <div key="username">{value}</div> // Render the username value
                                            ))}
                                    </div>
                                    <div className="text-sm">{event.start_time}</div>
                                    <div className="text-sm">{event.end_time}</div>
                                </div>
                                {/* Button back to the right */}
                                <button
                                    onClick={() => navigate(`/fullgameinfo/${event.id}`)}
                                    className="py-1 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <Modal onSubmit={handleModalSubmit} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
};

export default Home;
