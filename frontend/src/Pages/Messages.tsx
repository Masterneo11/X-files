
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// Interfaces for User and Message data
interface User {
    id: number;
    name: string;
    username: string;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    timestamp: string;
    status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Messages: React.FC = () => {
    const { attendeeId } = useParams<{ attendeeId: string }>();
    const { user, isAuthenticated } = useAuth0();

    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // Dynamically fetched user ID
    const [chatUser, setChatUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (isAuthenticated && user?.email) {
            checkUser(user.email).then(() => {
                if (loggedInUserId && attendeeId) {
                    fetchChatUser(attendeeId);
                    fetchMessages();
                }
            });
        }
    }, [isAuthenticated, user, loggedInUserId, attendeeId]);

    // Check if the user exists in the database
    const checkUser = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setLoggedInUserId(data.id); // Set the logged-in user ID
            } else {
                console.log("User not found. Creating a new user.");
                await createUser();
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
                setLoggedInUserId(createdUser.id); // Set the newly created user ID
            } else {
                console.error("Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const fetchChatUser = async (userId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setChatUser(data);
            } else {
                console.error("Failed to fetch user data.");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchMessages = async () => {
        if (!loggedInUserId || !attendeeId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/Messages/messages/${loggedInUserId}/${attendeeId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error("Failed to fetch messages.");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !loggedInUserId || !attendeeId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/Messages/messages/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender_id: loggedInUserId,
                    receiver_id: parseInt(attendeeId),
                    content: message,
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                setMessages((prev) => [...prev, newMessage]);
                setMessage("");
            } else {
                console.error("Failed to send message:", await response.json());
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUpdateMessageStatus = async (id: number, status: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Messages/messages/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                const updatedMessage = await response.json();
                setMessages((prev) =>
                    prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
                );
            }
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    };

    const handleDeleteMessage = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Messages/messages/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setMessages((prev) => prev.filter((msg) => msg.id !== id));
            } else {
                console.error("Failed to delete message.");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Chat header */}
            <div className="flex items-center justify-between bg-green-400 text-white px-4 py-3 shadow-md">
                <h2 className="text-lg font-bold">
                    Chat with {chatUser ? `${chatUser.name} (${chatUser.username})` : "Loading..."}
                </h2>
            </div>

            {/* Chat messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === loggedInUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`p-2 rounded-lg shadow-md ${msg.sender_id === loggedInUserId
                                        ? "bg-green-400 text-white"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.sender_id === loggedInUserId && (
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="ml-2 text-red-500 text-sm hover:underline"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet...</p>
                )}
            </div>

            {/* Chat input */}
            <div className="sticky bottom-0 flex items-center gap-2 p-4 border-t bg-white shadow-md">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    Send
                </button>
            </div>
        </div>
    );

    // return (
    //     <div className="flex flex-col h-screen bg-gray-100">
    //         {/* Chat header */}
    //         <div className="flex items-center justify-between bg-green-400 text-white px-4 py-3 shadow-md">
    //             <h2 className="text-lg font-bold">
    //                 Chat with {chatUser ? `${chatUser.name} (${chatUser.username})` : "Loading..."}
    //             </h2>
    //         </div>

    //         {/* Chat messages */}
    //         <div className="flex-grow overflow-y-auto p-4 space-y-4">
    //             {messages.length > 0 ? (
    //                 messages.map((msg) => (
    //                     <div
    //                         key={msg.id}
    //                         className={`flex ${msg.sender_id === loggedInUserId ? "justify-end" : "justify-start"}`}
    //                     >
    //                         <div className="flex items-center">
    //                             <div
    //                                 className={`p-2 rounded-lg shadow-md ${msg.sender_id === loggedInUserId
    //                                     ? "bg-green-400 text-white"
    //                                     : "bg-gray-200"
    //                                     }`}
    //                             >
    //                                 {msg.content}
    //                             </div>
    //                             {msg.sender_id === loggedInUserId && (
    //                                 <button
    //                                     onClick={() => handleDeleteMessage(msg.id)}
    //                                     className="ml-2 text-red-500 text-sm hover:underline"
    //                                 >
    //                                     Delete
    //                                 </button>
    //                             )}
    //                             {/* <button
    //                                 onClick={() => handleUpdateMessageStatus(msg.id, "read")}
    //                                 className="ml-2 text-blue-500 text-sm hover:underline"
    //                             >
    //                                 Mark as Read
    //                             </button> */}
    //                         </div>
    //                     </div>
    //                 ))
    //             ) : (
    //                 <p className="text-center text-gray-500">No messages yet...</p>
    //             )}
    //         </div>

    //         {/* Chat input */}
    //         <div className="flex items-center gap-2 p-4 border-t bg-white shadow-md">
    //             <input
    //                 type="text"
    //                 value={message}
    //                 onChange={(e) => setMessage(e.target.value)}
    //                 placeholder="Type your message..."
    //                 className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //             />
    //             <button
    //                 onClick={handleSendMessage}
    //                 className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
    //             >
    //                 Send
    //             </button>
    //         </div>
    //     </div>
    // );
};

export default Messages;
