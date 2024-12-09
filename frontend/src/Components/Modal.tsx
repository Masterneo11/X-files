import React, { useState } from "react";
import "./Modal.css"
interface ModalProps {
    onSubmit: (name: string, username: string,
        // email: string, photo?: string
    ) => void;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onSubmit, onClose }) => {
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    // const [email, setEmail] = useState<string>("");
    // const [photo, setPhoto] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, username,
            //  email, photo
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-85 flex justify-center items-center z-[200]">
            <div className="bg-gray-200 p-5 rounded-lg shadow-md w-[90%] max-w-[400px] text-center z-[200]">
                <h2 className="text-lg font-semibold mb-4">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {/* <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="text"
                        placeholder="Photo URL (optional)"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    /> */}
                    <button type="submit" className="w-full bg-green-500 text-white rounded py-2 hover:bg-green-600 transition duration-300">
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-gray-300 text-gray-700 rounded py-2 hover:bg-gray-400 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Modal;
