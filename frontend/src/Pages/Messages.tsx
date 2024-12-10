// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// // Interfaces for User and Message data
// interface User {
//     id: number;
//     name: string;
//     username: string;
// }

// interface Message {
//     id: number;
//     sender_id: number;
//     receiver_id: number;
//     content: string;
//     timestamp: string;
//     status: string;
// }

// const Messages: React.FC = () => {
//     // Extract logged-in user ID and attendee ID from the URL parameters
//     const { loggedInUserId, attendeeId } = useParams<{ loggedInUserId: string; attendeeId: string }>();

//     // State for chat user and messages
//     const [chatUser, setChatUser] = useState<User | null>(null);
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState<Message[]>([]);

//     // Ensure logged-in user ID and attendee ID are defined as strings
//     const loggedInUserIdStr = loggedInUserId || '';
//     const attendeeIdStr = attendeeId || '';

//     // Fetch the user the logged-in user is chatting with
//     const fetchChatUser = async (userId: string) => {
//         try {
//             const response = await fetch(`http://localhost:8000/profile/users/${userId}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setChatUser(data);
//             } else {
//                 console.error("Failed to fetch user data.");
//             }
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     };

//     // Fetch messages between the logged-in user and the chat user
//     const fetchMessages = async () => {
//         if (!loggedInUserIdStr || !attendeeIdStr) return; // Don't fetch if IDs are invalid

//         try {
//             const response = await fetch(`http://localhost:8000/messages/${loggedInUserIdStr}/${attendeeIdStr}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setMessages(data);
//             } else {
//                 console.error("Failed to fetch messages.");
//             }
//         } catch (error) {
//             console.error("Error fetching messages:", error);
//         }
//     };

//     // Load the chat user and messages when the component mounts
//     useEffect(() => {
//         if (attendeeIdStr) {
//             fetchChatUser(attendeeIdStr);
//             fetchMessages(); // Fetch messages when the component loads
//         }
//     }, [attendeeIdStr]);

//     // Handle message send
//     const handleSendMessage = async () => {
//         if (!message.trim()) return;

//         try {
//             const response = await fetch("http://localhost:8000/messages/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     sender_id: loggedInUserIdStr,
//                     receiver_id: attendeeIdStr,
//                     content: message,
//                 }),
//             });

//             if (response.ok) {
//                 const newMessage = await response.json();
//                 setMessages((prev) => [...prev, newMessage]); // Add the message to local state
//                 setMessage(""); // Clear the input field
//             }
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen bg-gray-100">
//             {/* Chat header */}
//             <div className="flex items-center justify-between bg-green-400 text-white px-4 py-3 shadow-md">
//                 <h2 className="text-lg font-bold">
//                     Chat with {chatUser ? `${chatUser.name} (${chatUser.username})` : "Loading..."}
//                 </h2>
//             </div>

//             {/* Chat messages */}
//             <div className="flex-grow overflow-y-auto p-4 space-y-4">
//                 {messages.length > 0 ? (
//                     messages.map((msg) => (
//                         <div
//                             key={msg.id}
//                             className={`flex ${msg.sender_id === parseInt(loggedInUserIdStr) ? "justify-end" : "justify-start"}`}
//                         >
//                             <div
//                                 className={`p-2 rounded-lg shadow-md ${msg.sender_id === parseInt(loggedInUserIdStr) ? "bg-green-400 text-white" : "bg-gray-200"
//                                     }`}
//                             >
//                                 {msg.content}
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-center text-gray-500">No messages yet...</p>
//                 )}
//             </div>

//             {/* Chat input */}
//             <div className="flex items-center gap-2 p-4 border-t bg-white shadow-md">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type your message..."
//                     className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                     onClick={handleSendMessage}
//                     className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Messages;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

const Messages: React.FC = () => {
    const { loggedInUserId, attendeeId } = useParams<{ loggedInUserId: string; attendeeId: string }>();

    const [chatUser, setChatUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [statusUpdate, setStatusUpdate] = useState<{ id: number; status: string }>({ id: 0, status: "" });

    const loggedInUserIdStr = loggedInUserId || "";
    const attendeeIdStr = attendeeId || "";

    useEffect(() => {
        if (attendeeIdStr) {
            fetchChatUser(attendeeIdStr);
            fetchMessages();
        }
    }, [attendeeIdStr]);

    const fetchChatUser = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/profile/users/${userId}`);
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
        try {
            const response = await fetch(`http://localhost:8000/messages/${loggedInUserIdStr}/${attendeeIdStr}`);
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
        if (!message.trim()) return;

        try {
            const response = await fetch("http://localhost:8000/messages/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender_id: parseInt(loggedInUserIdStr),
                    receiver_id: parseInt(attendeeIdStr),
                    content: message,
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                setMessages((prev) => [...prev, newMessage]);
                setMessage("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUpdateMessageStatus = async (id: number, status: string) => {
        try {
            const response = await fetch(`http://localhost:8000/messages/${id}`, {
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
            const response = await fetch(`http://localhost:8000/messages/${id}`, {
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
                            className={`flex ${msg.sender_id === parseInt(loggedInUserIdStr) ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div className="flex items-center">
                                <div
                                    className={`p-2 rounded-lg shadow-md ${msg.sender_id === parseInt(loggedInUserIdStr)
                                        ? "bg-green-400 text-white"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.sender_id === parseInt(loggedInUserIdStr) && (
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="ml-2 text-red-500 text-sm hover:underline"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    onClick={() => handleUpdateMessageStatus(msg.id, "read")}
                                    className="ml-2 text-blue-500 text-sm hover:underline"
                                >
                                    Mark as Read
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet...</p>
                )}
            </div>

            {/* Chat input */}
            <div className="flex items-center gap-2 p-4 border-t bg-white shadow-md">
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
};

export default Messages;
