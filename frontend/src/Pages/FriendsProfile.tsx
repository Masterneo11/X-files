import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import basicphoto from "../assets/avatar.png";

const API_BASE_URL = "http://localhost:8000"; // Backend URL

interface FriendRequest {
    user_id_1: number;
    user_id_2: number;
}

const FriendsProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated } = useAuth0(); // Auth0 for authentication
    const [currentUserId, setCurrentUserId] = useState<number | null>(null); // Current logged-in user ID
    const [profileUser, setProfileUser] = useState<any>(null);
    const [friends, setFriends] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [friendRequestError, setFriendRequestError] = useState<string | null>(
        null
    );
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [friendRequestStatus, setFriendRequestStatus] = useState<string | null>(
        null
    );

    // Check if the logged-in user exists in the database
    const checkUser = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUserId(data.id); // Set the logged-in user ID
            } else {
                console.log("User not found. Creating a new user.");
                createUser();
            }
        } catch (error) {
            console.error("Error checking user:", error);
        }
    };

    // Create a new user in the database
    const createUser = async () => {
        if (!user || !user.email) return;

        const newUser = {
            name: user.name || "Anonymous",
            username: user.nickname || user.name || "Anonymous",
            email: user.email,
            photo: user.picture || null,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                const createdUser = await response.json();
                setCurrentUserId(createdUser.id); // Set the newly created user ID
            } else {
                console.error("Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Fetch the profile user's details
    const fetchProfileUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/users/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            const data = await response.json();
            setProfileUser(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Fetch the profile user's friends
    const fetchFriends = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/users/${id}/friends`);
            if (!response.ok) {
                throw new Error("Failed to fetch user's friends");
            }
            const data = await response.json();
            setFriends(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.email) {
            checkUser(user.email);
        }
        fetchProfileUser();
        fetchFriends();
    }, [isAuthenticated, user, id]);

    const sendFriendRequest = async (targetUserId: number) => {
        if (!currentUserId || currentUserId === targetUserId) {
            console.error("Invalid request: Cannot send a friend request to yourself.");
            setFriendRequestError("Cannot send a friend request to yourself.");
            return;
        }

        const payload: FriendRequest = {
            user_id_1: currentUserId,
            user_id_2: targetUserId,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Friends/friends/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.detail || "Failed to send friend request.");
            }

            setIsRequestSent(true);
            setFriendRequestStatus("Friend request sent successfully!");
        } catch (error: any) {
            setFriendRequestError(error.message);
        }
    };

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!profileUser) {
        return <p className="text-gray-600 text-center">Loading user details...</p>;
    }

    return (
        <div className="min-h-screen bg-white-100 text-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center space-x-4">
                    <img
                        src={profileUser.picture || basicphoto}
                        alt={`${profileUser.name}'s avatar`}
                        className="w-20 h-20 rounded-full border-2 border-pink-500"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{profileUser.name}</h2>
                        <p className="text-gray-400">@{profileUser.username}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-between text-center">
                    <div>
                        <p className="text-lg font-bold">{friends.length}</p>
                        <p className="text-sm text-gray-400">Friends</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Friends</h3>
                    {friends.length > 0 ? (
                        <ul className="space-y-2">
                            {friends.map((friend) => (
                                <li
                                    key={friend.id}
                                    className="p-2 bg-gray-100 rounded flex justify-between items-center"
                                >
                                    <span>{friend.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No friends found.</p>
                    )}
                </div>

                {friendRequestError && (
                    <p className="text-red-500 mt-4 text-center">{friendRequestError}</p>
                )}

                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={() => sendFriendRequest(Number(id))}
                        className={`flex-1 py-2 rounded text-white font-semibold ${isRequestSent ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {isRequestSent ? "Cancel Request" : "Add Friend"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendsProfile;
