// import React, { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import FindFriends from "./FindFriends";


// const API_BASE_URL = "http://localhost:8000"; // Ensure this matches your backend URL

// interface UserResponse {
//     id: number;
//     name: string;
//     email: string;
// }
// // const { user } = useAuth0();

// const Profile: React.FC = () => {
//     const { user, isAuthenticated, isLoading } = useAuth0();
//     const [friends, setFriends] = useState<UserResponse[]>([]);
//     const [error, setError] = useState<string | null>(null);

//     // useEffect(() => {
//     //     if (isAuthenticated && user) {
//     //         fetchUserFriends(user.sub);
//     //     }
//     // }, [isAuthenticated, user]);

//     // const fetchUserFriends = async (userId: string) => {
//     //     try {
//     //         const response = await fetch(`${API_BASE_URL}/users/${userId}/friends`);
//     //         if (!response.ok) {
//     //             throw new Error("Failed to load friends");
//     //         }
//     //         const data = await response.json();
//     //         setFriends(data);
//     //     } catch (error: any) {
//     //         setError(error.message);
//     //     }
//     // };

//     const sendFriendRequest = async (userId1: number, userId2: number) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/friends/request`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ user_id_1: userId1, user_id_2: userId2 }),
//             });
//             if (!response.ok) {
//                 throw new Error("Failed to send friend request");
//             }
//             console.log("Friend request sent!");
//         } catch (error: any) {
//             setError(error.message);
//         }
//     };

//     if (isLoading) {
//         return <div className=" container flex align-middle justify-center h-28 w-24 text-lg" >Loading ...</div>;
//     }

//     return (
//         <>

//             <div className="min-h-screen bg-gray-100 p-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
//                     {/* Profile Section */}
//                     <div className="flex flex-col items-center">
//                         <h1 className="text-2xl font-bold mb-4">Profile</h1>
//                         {error && <p className="text-red-500">{error}</p>}

//                         {isAuthenticated && user && (
//                             <div className="text-center">
//                                 <img
//                                     className="w-24 h-24 rounded-full mb-4"
//                                     src={user.picture}
//                                     alt={user.name}
//                                 />
//                                 <h2 className="text-lg font-semibold">{user.name}</h2>
//                                 <p className="text-gray-600">{user.email}</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Friends List Section */}
//                     <div className="flex flex-col">
//                         <h2 className="text-xl font-bold mb-4">Friends </h2>
//                         {friends.length > 0 ? (
//                             <ul className="list-disc list-inside text-gray-700">
//                                 {friends.map((friend) => (
//                                     <li key={friend.id} className="mb-2">
//                                         <span className="font-medium">{friend.name}</span> - {friend.email}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (

//                             <div className="text-gray-700 text-center text-2xl font-bold">0</div>
//                         )}
//                     </div>

//                     {/* Actions Section */}
//                     <div className="flex flex-col items-center">
//                         <button
//                             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                             onClick={() => sendFriendRequest(1, 2)}
//                         >
//                             Send Friend Request
//                         </button>
//                     </div>
// <Link to="/find-friends" style={{ textDecoration: "none" }}>
//<div className="flex flex-col items-center bg-green align-middle justify-center text-white rounded-xl cursor-pointer">
//    <FindFriends />
//</div>
//</Link> */}

//                     <div className="flex flex-col items-center bg-green align-middle justify-center text-white rounded-xl">
//                         <FindFriends />
//                     </div>
//                 </div>
//             </div>


//         </>
//     );
// };

// export default Profile;













































































import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom"; // Import Link
import FindFriends from "./FindFriends";

const API_BASE_URL = "http://localhost:8000"; // Ensure this matches your backend URL

interface UserResponse {
    id: number;
    name: string;
    email: string;
    username: string;
}

const Profile: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [friends, setFriends] = useState<UserResponse[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sendFriendRequest = async (userId1: number, userId2: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/friends/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id_1: userId1, user_id_2: userId2 }),
            });
            if (!response.ok) {
                throw new Error("Failed to send friend request");
            }
            console.log("Friend request sent!");
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="container flex align-middle justify-center h-28 w-24 text-lg">
                Loading ...
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-4">Profile</h1>
                        {error && <p className="text-red-500">{error}</p>}

                        {isAuthenticated && user && (
                            <div className="text-center">
                                <img
                                    className="w-24 h-24 rounded-full mb-4"
                                    src={user.picture}
                                    alt={user.name}
                                />
                                <h2 className="text-lg font-semibold">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Friends List Section */}
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Friends </h2>
                        {friends.length > 0 ? (
                            <ul className="list-disc list-inside text-blue-700">
                                {friends.map((friend) => (
                                    <li key={friend.id} className="mb-2">
                                        <span className="font-medium">{friend.name}</span> - {friend.username}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-700 text-center text-2xl font-bold">0</div>
                        )}
                    </div>

                    {/* Actions Section */}
                    <div className="flex flex-col items-center">
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => sendFriendRequest(1, 2)}
                        >
                            Send Friend Request
                        </button>
                    </div>

                    {/* Find Friends Section */}
                    <div className="flex flex-col items-center bg-green-400 align-middle justify-center text-white rounded-xl cursor-pointer">
                        <Link
                            to="/findfriends"
                            className="text-lg font-semibold"
                            style={{ textDecoration: "none" }}
                        >
                            Go to Find Friends
                        </Link>
                    </div>
                    {/* <Link to="/findfriends" style={{ textDecoration: "none" }}>
                        <div className="flex flex-col items-center bg-green align-middle justify-center text-white rounded-xl cursor-pointer">
                            <FindFriends />
                        </div>
                    </Link> */}
                </div>
            </div>
        </>
    );
};

export default Profile;

