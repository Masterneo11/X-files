import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import basicphoto from "../assets/avatar.png";

const API_BASE_URL = "http://localhost:8000"; // Backend URL

// Interfaces for expected API responses
interface UserResponse {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface FriendRequest {
    friendship_id: number;
    sender_id: number;
    username: string;
    name: string;
    photo?: string;
}

const Profile: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [userId, setUserId] = useState<number | null>(null);
    const [userDetails, setUserDetails] = useState<UserResponse | null>(null);
    const [friends, setFriends] = useState<UserResponse[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Check if the user exists in the database
    const checkUser = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setUserId(data.id);
                setUserDetails(data);
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
                setUserId(createdUser.id);
                setUserDetails(createdUser);
            } else {
                console.error("Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Fetch friends list
    const fetchFriends = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/Friends/friends/${userId}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch friends");
            }
            const data: UserResponse[] = await response.json();
            setFriends(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Fetch incoming friend requests
    const fetchFriendRequests = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/Friends/friends/requests/${userId}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch friend requests");
            }
            const data: FriendRequest[] = await response.json();
            console.log("Friend Requests Data:", data); // Debugging response
            setFriendRequests(data);
        } catch (error: any) {
            console.error("Error fetching friend requests:", error);
            setError(error.message);
        }
    };

    // Accept a friend request
    const acceptFriendRequest = async (requestId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Friends/friends/accept/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to accept friend request");
            }
            setFriendRequests(friendRequests.filter((request) => request.friendship_id !== requestId));
        } catch (error: any) {
            console.error("Error accepting friend request:", error);
            setError(error.message);
        }
    };

    // Decline a friend request
    const declineFriendRequest = async (senderId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/friends/request/${senderId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to decline friend request");
            }
            setFriendRequests(friendRequests.filter((request) => request.sender_id !== senderId));
        } catch (error: any) {
            console.error("Error declining friend request:", error);
            setError(error.message);
        }
    };

    // Initialize user details on component mount
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            checkUser(user.email);
        }
    }, [isAuthenticated, user]);

    // Fetch friends and friend requests after the user ID is set
    useEffect(() => {
        if (userId) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [userId]);

    if (isLoading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (!isAuthenticated) {
        return <p className="text-center text-red-500">Please log in to view your profile.</p>;
    }

    return (
        <div className="min-h-screen bg-white-100 text-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                    <img
                        src={user?.picture || basicphoto}
                        alt={`${userDetails?.name || "User"}'s avatar`}
                        className="w-20 h-20 rounded-full border-2 border-gray-700"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{userDetails?.name || "Name not available"}</h2>
                        <p className="text-gray-400">@{userDetails?.username || "Username not available"}</p>
                    </div>
                </div>

                {/* Friends Section */}
                <div className="mt-6">
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

                {/* Incoming Friend Requests Section */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Incoming Friend Requests</h3>
                    {friendRequests.length > 0 ? (
                        <ul className="space-y-2">
                            {friendRequests.map((request) => (
                                <li
                                    key={request.friendship_id}
                                    className="p-2 bg-gray-100 rounded flex justify-between items-center"
                                >
                                    <div>
                                        <span className="font-medium">{request.name}</span>{" "}
                                        <span className="text-gray-400">@{request.username}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => acceptFriendRequest(request.friendship_id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => declineFriendRequest(request.sender_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No incoming friend requests.</p>
                    )}
                </div>

                {/* Find Friends Link */}
                <div className="mt-6">
                    <Link
                        to="/findfriends"
                        className="block py-3 text-center bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                    >
                        Find Friends
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
