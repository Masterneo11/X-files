
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import basicphoto from "../assets/avatar.png";

// const API_BASE_URL = "http://localhost:8000"; // Backend URL

// const FriendsProfile: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const [user, setUser] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/profile/users/${id}`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user details");
//                 }
//                 const data = await response.json();
//                 setUser(data);
//             } catch (error: any) {
//                 setError(error.message);
//             }
//         };

//         fetchUser();
//     }, [id]);

//     if (error) {
//         return <p className="text-red-500 text-center">{error}</p>;
//     }

//     if (!user) {
//         return <p className="text-gray-600 text-center">Loading user details...</p>;
//     }

//     return (
//         <div className="min-h-screen bg-white-100 text-gray-900 p-6">
//             <div className="max-w-2xl mx-auto">
//                 {/* Profile Header */}
//                 <div className="flex items-center space-x-4">
//                     <img
//                         src={user.picture || basicphoto}
//                         alt={`${user.name}'s avatar`}
//                         className="w-20 h-20 rounded-full border-2 border-pink-500"
//                     />
//                     <div className="flex-1">
//                         <h2 className="text-2xl font-bold">{user.name}</h2>
//                         <p className="text-gray-400">@{user.username}</p>
//                     </div>
//                 </div>

//                 {/* Metrics */}
//                 <div className="mt-6 flex justify-between text-center">
//                     <div>
//                         <p className="text-lg font-bold">{user.posts || 0}</p>
//                         <p className="text-sm text-gray-400">posts</p>
//                     </div>
//                     <div>
//                         <p className="text-lg font-bold">{user.followers || 0}K</p>
//                         <p className="text-sm text-gray-400">followers</p>
//                     </div>
//                     <div>
//                         <p className="text-lg font-bold">{user.following || 0}</p>
//                         <p className="text-sm text-gray-400">following</p>
//                     </div>
//                 </div>

//                 {/* Bio Section */}
//                 <div className="mt-4">
//                     <p className="text-base">{user.bio || "No bio available"}</p>
//                     <a
//                         href={user.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 underline mt-2 block"
//                     >
//                         {user.link || "No link available"}
//                     </a>
//                 </div>

//                 {/* Buttons */}
//                 <div className="mt-6 flex space-x-4">
//                     <button className="flex-1 bg-blue-500 py-2 rounded text-white font-semibold hover:bg-blue-600">
//                         Follow
//                     </button>
//                     <button className="flex-1 bg-gray-700 py-2 rounded text-white font-semibold hover:bg-gray-800">
//                         Message
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FriendsProfile;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import basicphoto from "../assets/avatar.png";

// const API_BASE_URL = "http://localhost:8000"; // Backend URL

// const FriendsProfile: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const [user, setUser] = useState<any>(null);
//     const [friends, setFriends] = useState<any[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [friendRequestError, setFriendRequestError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/profile/users/${id}`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user details");
//                 }
//                 const data = await response.json();
//                 setUser(data);
//             } catch (error: any) {
//                 setError(error.message);
//             }
//         };

//         const fetchFriends = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/profile/users/${id}/friends`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user's friends");
//                 }
//                 const data = await response.json();
//                 setFriends(data);
//             } catch (error: any) {
//                 setError(error.message);
//             }
//         };

//         fetchUser();
//         fetchFriends();
//     }, [id]);

//     const sendFriendRequest = async (targetUserId: number) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/friends/request`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     user_id_1: Number(id), // Current user's ID
//                     user_id_2: targetUserId, // Target friend's ID
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to send friend request");
//             }
//             alert("Friend request sent!");
//         } catch (error: any) {
//             setFriendRequestError(error.message);
//         }
//     };

//     if (error) {
//         return <p className="text-red-500 text-center">{error}</p>;
//     }

//     if (!user) {
//         return <p className="text-gray-600 text-center">Loading user details...</p>;
//     }

//     return (
//         <div className="min-h-screen bg-white-100 text-gray-900 p-6">
//             <div className="max-w-2xl mx-auto">
//                 {/* Profile Header */}
//                 <div className="flex items-center space-x-4">
//                     <img
//                         src={user.picture || basicphoto}
//                         alt={`${user.name}'s avatar`}
//                         className="w-20 h-20 rounded-full border-2 border-pink-500"
//                     />
//                     <div className="flex-1">
//                         <h2 className="text-2xl font-bold">{user.name}</h2>
//                         <p className="text-gray-400">@{user.username}</p>
//                     </div>
//                 </div>

//                 {/* Metrics */}
//                 <div className="mt-6 flex justify-between text-center">
//                     <div>
//                         <p className="text-lg font-bold">{user.posts || 0}</p>
//                         <p className="text-sm text-gray-400">posts</p>
//                     </div>
//                     <div>
//                         <p className="text-lg font-bold">{user.followers || 0}K</p>
//                         <p className="text-sm text-gray-400">followers</p>
//                     </div>
//                     <div>
//                         <p className="text-lg font-bold">{user.following || 0}</p>
//                         <p className="text-sm text-gray-400">following</p>
//                     </div>
//                 </div>

//                 {/* Friends Section */}
//                 <div className="mt-8">
//                     <h3 className="text-xl font-semibold mb-4">Friends</h3>
//                     {friends.length > 0 ? (
//                         <ul className="space-y-2">
//                             {friends.map((friend) => (
//                                 <li
//                                     key={friend.id}
//                                     className="p-2 bg-gray-100 rounded flex justify-between items-center"
//                                 >
//                                     <span>{friend.name}</span>
//                                     <button
//                                         onClick={() => sendFriendRequest(friend.id)}
//                                         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                                     >
//                                         Add Friend
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-600">No friends found.</p>
//                     )}
//                 </div>

//                 {/* Friend Request Error */}
//                 {friendRequestError && (
//                     <p className="text-red-500 mt-4 text-center">{friendRequestError}</p>
//                 )}

//                 {/* Bio Section */}
//                 <div className="mt-4">
//                     <p className="text-base">{user.bio || "No bio available"}</p>
//                     <a
//                         href={user.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 underline mt-2 block"
//                     >
//                         {user.link || "No link available"}
//                     </a>
//                 </div>

//                 {/* Buttons */}
//                 <div className="mt-6 flex space-x-4">
//                     <button className="flex-1 bg-blue-500 py-2 rounded text-white font-semibold hover:bg-blue-600">
//                         send
//                     </button>
//                     <button className="flex-1 bg-gray-700 py-2 rounded text-white font-semibold hover:bg-gray-800">
//                         Message
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FriendsProfile;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import basicphoto from "../assets/avatar.png";

// const API_BASE_URL = "http://localhost:8000"; // Backend URL

// const FriendsProfile: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const [user, setUser] = useState<any>(null);
//     const [friends, setFriends] = useState<any[]>([]);
//     const [error, setError] = useState<string | null>(null);
//     const [friendRequestError, setFriendRequestError] = useState<string | null>(null);
//     const [isRequestSent, setIsRequestSent] = useState(false); // Track request status

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/profile/users/${id}`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user details");
//                 }
//                 const data = await response.json();
//                 setUser(data);
//             } catch (error: any) {
//                 setError(error.message);
//             }
//         };

//         const fetchFriends = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/profile/users/${id}/friends`);
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user's friends");
//                 }
//                 const data = await response.json();
//                 setFriends(data);
//             } catch (error: any) {
//                 setError(error.message);
//             }
//         };

//         fetchUser();
//         fetchFriends();
//     }, [id]);

//     const sendFriendRequest = async (targetUserId: number) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/profile/friends/request`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     user_id_1: Number(id), // Current user's ID
//                     user_id_2: targetUserId, // Target friend's ID
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to send friend request");
//             }
//             setIsRequestSent(true); // Update the state to reflect the request
//         } catch (error: any) {
//             setFriendRequestError(error.message);
//         }
//     };

//     if (error) {
//         return <p className="text-red-500 text-center">{error}</p>;
//     }

//     if (!user) {
//         return <p className="text-gray-600 text-center">Loading user details...</p>;
//     }

//     return (
//         <div className="min-h-screen bg-white-100 text-gray-900 p-6">
//             <div className="max-w-2xl mx-auto">
//                 {/* Profile Header */}
//                 <div className="flex items-center space-x-4">
//                     <img
//                         src={user.picture || basicphoto}
//                         alt={`${user.name}'s avatar`}
//                         className="w-20 h-20 rounded-full border-2 border-pink-500"
//                     />
//                     <div className="flex-1">
//                         <h2 className="text-2xl font-bold">{user.name}</h2>
//                         <p className="text-gray-400">@{user.username}</p>
//                     </div>
//                 </div>

//                 {/* Metrics */}
//                 <div className="mt-6 flex justify-between text-center">
//                     <div>
//                         <p className="text-lg font-bold">{friends.length}</p>
//                         <p className="text-sm text-gray-400">friends</p>
//                     </div>
//                 </div>

//                 {/* Friends Section */}
//                 <div className="mt-8">
//                     <h3 className="text-xl font-semibold mb-4">Friends</h3>
//                     {friends.length > 0 ? (
//                         <ul className="space-y-2">
//                             {friends.map((friend) => (
//                                 <li
//                                     key={friend.id}
//                                     className="p-2 bg-gray-100 rounded flex justify-between items-center"
//                                 >
//                                     <span>{friend.name}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-600">No friends found.</p>
//                     )}
//                 </div>

//                 {/* Friend Request Error */}
//                 {friendRequestError && (
//                     <p className="text-red-500 mt-4 text-center">{friendRequestError}</p>
//                 )}

//                 {/* Bio Section */}
//                 <div className="mt-4">
//                     <p className="text-base">{user.bio || "No bio available"}</p>
//                     <a
//                         href={user.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 underline mt-2 block"
//                     >
//                         {user.link || "No link available"}
//                     </a>
//                 </div>

//                 {/* Buttons */}
//                 <div className="mt-6 flex space-x-4">
//                     <button
//                         onClick={() => sendFriendRequest(Number(id))}
//                         className={`flex-1 py-2 rounded text-white font-semibold ${isRequestSent ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
//                             }`}
//                     >
//                         {isRequestSent ? "Cancel Request" : "Follow"}
//                     </button>
//                     <button className="flex-1 bg-gray-700 py-2 rounded text-white font-semibold hover:bg-gray-800">
//                         Message
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FriendsProfile;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import basicphoto from "../assets/avatar.png";

const API_BASE_URL = "http://localhost:8000"; // Backend URL

const FriendsProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>(null);
    const [friends, setFriends] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]); // New state for incoming requests
    const [error, setError] = useState<string | null>(null);
    const [friendRequestError, setFriendRequestError] = useState<string | null>(null);
    const [isRequestSent, setIsRequestSent] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/profile/users/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }
                const data = await response.json();
                setUser(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

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

        // const fetchIncomingRequests = async () => {
        //     try {
        //         const response = await fetch(`${API_BASE_URL}/friends/requests/${id}`);
        //         if (!response.ok) {
        //             throw new Error("Failed to fetch incoming friend requests");
        //         }
        //         const data = await response.json();
        //         setIncomingRequests(data);
        //     } catch (error: any) {
        //         setError(error.message);
        //     }
        // };

        fetchUser();
        fetchFriends();
        // fetchIncomingRequests();
    }, [id]);

    const sendFriendRequest = async (targetUserId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/friends/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id_1: Number(id), // Current user's ID
                    user_id_2: targetUserId, // Target friend's ID
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send friend request");
            }
            setIsRequestSent(true);
        } catch (error: any) {
            setFriendRequestError(error.message);
        }
    };

    const cancelFriendRequest = async (targetUserId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/friends/request/${targetUserId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to cancel friend request");
            }
            setIsRequestSent(false);
        } catch (error: any) {
            setFriendRequestError(error.message);
        }
    };

    const acceptFriendRequest = async (requestId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/friends/accept/${requestId}`, {
                method: "PATCH",
            });

            if (!response.ok) {
                throw new Error("Failed to accept friend request");
            }
            setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId)); // Remove accepted request
            alert("Friend request accepted!");
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!user) {
        return <p className="text-gray-600 text-center">Loading user details...</p>;
    }

    return (
        <div className="min-h-screen bg-white-100 text-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                    <img
                        src={user.picture || basicphoto}
                        alt={`${user.name}'s avatar`}
                        className="w-20 h-20 rounded-full border-2 border-pink-500"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-400">@{user.username}</p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="mt-6 flex justify-between text-center">
                    <div>
                        <p className="text-lg font-bold">{friends.length}</p>
                        <p className="text-sm text-gray-400">friends</p>
                    </div>
                </div>

                {/* Friends Section */}
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

                {/* Incoming Friend Requests */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Incoming Friend Requests</h3>
                    {incomingRequests.length > 0 ? (
                        <ul className="space-y-2">
                            {incomingRequests.map((request) => (
                                <li
                                    key={request.id}
                                    className="p-2 bg-gray-100 rounded flex justify-between items-center"
                                >
                                    <span>{request.senderName}</span>
                                    <button
                                        onClick={() => acceptFriendRequest(request.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Accept
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No incoming friend requests.</p>
                    )}
                </div>

                {/* Friend Request Error */}
                {friendRequestError && (
                    <p className="text-red-500 mt-4 text-center">{friendRequestError}</p>
                )}

                {/* Buttons */}
                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={() =>
                            isRequestSent
                                ? cancelFriendRequest(Number(id))
                                : sendFriendRequest(Number(id))
                        }
                        className={`flex-1 py-2 rounded text-white font-semibold ${isRequestSent ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {isRequestSent ? "Cancel Request" : "Follow"}
                    </button>
                    <button className="flex-1 bg-gray-700 py-2 rounded text-white font-semibold hover:bg-gray-800">
                        Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendsProfile;
