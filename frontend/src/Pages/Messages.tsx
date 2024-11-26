// // const Messages: React.FC = () => {
// //     return (
// //         <div className="flex flex-col h-screen bg-gray-100">
// //             {/* Chat header */}
// //             <div className="flex items-center justify-between bg-green-400 text-white px-4 py-3 shadow-md">
// //                 <h2 className="text-lg font-bold">Chat</h2>
// //             </div>

// //             {/* Chat messages */}
// //             <div className="flex-grow overflow-y-auto p-4 space-y-4">


// //                 <div className="flex justify-start">

// //                 </div>
// //             </div>

// //             {/* Chat input */}
// //             <div className="flex items-center gap-2 p-4 border-t bg-white shadow-md">
// //                 <input
// //                     type="text"
// //                     placeholder="Type your message..."
// //                     className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //                 <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-400">
// //                     Send
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Messages;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// interface User {
//     id: number;
//     name: string;
//     username: string;
// }

// const Messages: React.FC = () => {
//     const { loggedInUserId, attendeeId } = useParams<{ loggedInUserId: string; attendeeId: string }>();
//     const [chatUser, setChatUser] = useState<User | null>(null);
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState<string[]>([]); // Temporary local message storage

//     // Fetch the user you are chatting with
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

//     // Load the chat user when the component mounts
//     useEffect(() => {
//         if (attendeeId) {
//             fetchChatUser(attendeeId);
//         }
//     }, [attendeeId]);

//     // Handle message send
//     const handleSendMessage = async () => {
//         if (!message.trim()) return;

//         try {
//             const response = await fetch("http://localhost:8000/messages/send", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     senderId: loggedInUserId,
//                     receiverId: attendeeId,
//                     content: message,
//                 }),
//             });

//             if (response.ok) {
//                 setMessages((prev) => [...prev, message]); // Add the message to local state
//                 setMessage(""); // Clear the input field
//             } else {
//                 console.error("Failed to send message.");
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
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
//                         <div
//                             className={`p-2 rounded-lg shadow-md ${index % 2 === 0 ? "bg-green-400 text-white" : "bg-gray-200"
//                                 }`}
//                         >
//                             {msg}
//                         </div>
//                     </div>
//                 ))}
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
    // Extract logged-in user ID and attendee ID from the URL parameters
    const { loggedInUserId, attendeeId } = useParams<{ loggedInUserId: string; attendeeId: string }>();

    // State for chat user and messages
    const [chatUser, setChatUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    // Ensure logged-in user ID and attendee ID are defined as strings
    const loggedInUserIdStr = loggedInUserId || '';
    const attendeeIdStr = attendeeId || '';

    // Fetch the user the logged-in user is chatting with
    const fetchChatUser = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/profile/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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

    // Fetch messages between the logged-in user and the chat user
    const fetchMessages = async () => {
        if (!loggedInUserIdStr || !attendeeIdStr) return; // Don't fetch if IDs are invalid

        try {
            const response = await fetch(`http://localhost:8000/messages/${loggedInUserIdStr}/${attendeeIdStr}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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

    // Load the chat user and messages when the component mounts
    useEffect(() => {
        if (attendeeIdStr) {
            fetchChatUser(attendeeIdStr);
            fetchMessages(); // Fetch messages when the component loads
        }
    }, [attendeeIdStr]);

    // Handle message send
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            const response = await fetch("http://localhost:8000/messages/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender_id: loggedInUserIdStr,
                    receiver_id: attendeeIdStr,
                    content: message,
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                setMessages((prev) => [...prev, newMessage]); // Add the message to local state
                setMessage(""); // Clear the input field
            }
        } catch (error) {
            console.error("Error sending message:", error);
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
                            className={`flex ${msg.sender_id === parseInt(loggedInUserIdStr) ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-2 rounded-lg shadow-md ${msg.sender_id === parseInt(loggedInUserIdStr) ? "bg-green-400 text-white" : "bg-gray-200"
                                    }`}
                            >
                                {msg.content}
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
