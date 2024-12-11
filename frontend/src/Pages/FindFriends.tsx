
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import basicphoto from "../assets/avatar.png"; // Default avatar image

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FindFriends: React.FC = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchUserFriends = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/friends`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch friends");
            }
            const data = await response.json();
            setFriends(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUserFriends();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Find Friends</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {friends.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {friends.map((friend) => (
                        <li
                            key={friend.id}
                            className="flex items-center bg-white p-4 first:rounded-t-lg last:rounded-b-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/user/${friend.id}`)} // Navigate to user detail page
                        >
                            <img
                                src={friend.picture || basicphoto} // Use friend's picture or default avatar
                                alt={`${friend.name}'s avatar`}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-500 text-lg">{friend.name}</span>
                                <span className="text-gray-700 text-sm">{friend.username}</span>
                            </div>
                            <button
                                className="ml-auto bg-blue-300 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the navigation
                                    console.log(`Followed ${friend.name}`);
                                }}
                            >
                                Follow
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 text-center">No friends found.</p>
            )}
        </div>
    );
};

export default FindFriends;
