import React, { useState } from "react";

// Interface for the new club data
interface ClubData {
    name: string;
    description: string;
    private: boolean;
}

const ClubsCreate: React.FC = () => {
    // Form state
    const [formData, setFormData] = useState<ClubData>({
        name: "",
        description: "",
        private: true,
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Reset the form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            private: true,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/Clubs/clubs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Club created:", data);
            alert("Club created successfully!");
            resetForm();
        } catch (error) {
            console.error("Error creating club:", error);
            alert("Failed to create club. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Create a Club</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Club Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                            Club Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter the club name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Club Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the club"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Privacy Setting */}
                    <div className="flex items-center justify-between">
                        <label className="text-gray-700 font-medium">Private Club?</label>
                        <input
                            name="private"
                            type="checkbox"
                            checked={formData.private}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Create Club
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClubsCreate;
