// import React, { useState, } from "react";

// const MakeAccount: React.FC = () => {
//     const [name, setName] = useState<string>("");
//     const [userName, setUserName] = useState<string>("");
//     return (
//         <>
//             <div className=" container mt-28 flex flex-col items-center h-144 w-100">
//                 <input
//                     placeholder="Name"
//                     value={name}
//                     className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
//                     onChange={(e) => setName(e.target.value)}></input>
//                 <input
//                     placeholder="Username"
//                     value={userName}
//                     className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
//                     onChange={(e) => setUserName(e.target.value)}></input>
//                 <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full text-center">

//                 </div>
//             </div>
//         </>
//     )
// }
// // export default MakeAccount;
// import React, { useState } from "react";

// interface MakeAccountProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSubmit: (name: string, userName: string) => void;
// }

// const MakeAccount: React.FC<MakeAccountProps> = ({ isOpen, onClose, onSubmit }) => {
//     const [name, setName] = useState<string>("");
//     const [userName, setUserName] = useState<string>("");

//     const handleSubmit = () => {
//         if (name && userName) {
//             onSubmit(name, userName);
//             onClose(); 
//         } else {
//             alert("Please fill out all fields.");
//         }
//     };

//     if (!isOpen) return null; 

//     return (
//         <div className="modal-overlay">
//             <div className="modal-container">
//                 <h2 className="text-lg font-bold">Create Account</h2>
//                 <input
//                     placeholder="Name"
//                     value={name}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 <input
//                     placeholder="Username"
//                     value={userName}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     onChange={(e) => setUserName(e.target.value)}
//                 />
//                 <button
//                     className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md"
//                     onClick={handleSubmit}
//                 >
//                     Submit
//                 </button>
//                 <button
//                     className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
//                     onClick={onClose}
//                 >
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MakeAccount;

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
