
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ClubsCreate: React.FC = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Title */}
            <h2 className="text-xl font-bold mb-6 text-green-600">Your clubs</h2>

            {/* Create Clubs Button */}
            <button
                onClick={() => navigate("/clubscreate")} // Redirect to create-club page
                className="flex items-center justify-between bg-green-200 text-green-800 px-4 py-2 rounded-lg w-full max-w-sm mb-6 hover:bg-green-300 transition"
            >
                <span>Create clubs</span>
            </button>

            {/* Clubs List */}
            <div className="space-y-4">
                {/* Spike Club */}
                <div className="border border-green-200 bg-green-50 text-green-700 p-4 rounded-lg">
                    <h3 className="font-bold">Spike club</h3>
                    <p className="text-sm">Anyone can join</p>
                </div>

                {/* Tourney Club */}
                <div className="border border-blue-300 bg-blue-50 text-blue-700 p-4 rounded-lg">
                    <h3 className="font-bold">Tourney Club</h3>
                    <p className="text-sm">Invited members only</p>
                </div>
            </div>
        </div>
    );
};

export default ClubsCreate;
