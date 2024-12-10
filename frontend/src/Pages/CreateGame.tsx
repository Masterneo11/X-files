

import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MaskedInput from "react-text-mask";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = "http://localhost:8000";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface CreateUser {
    id?: number;
    name: string;
    username: string;
    email: string;
    photo?: string | null;
}

const CreateGame: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();
    const [userId, setUserId] = useState<number | null>(null); // Store fetched user ID
    const [eventTitle, setEventTitle] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [eventDay, setEventDay] = useState<string>("");
    const [eventMonth, setEventMonth] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [maxPlayers, setMaxPlayers] = useState<number>(2);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    // Check if the user exists in the database
    const checkUser = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/by-email/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setUserId(data.id); // Set the user ID
            } else {
                console.log("User not found. Creating a new user.");
                createUser();
            }
        } catch (error) {
            console.error("Error checking user:", error);
        }
    };

    // Create a new user in the database
    const createUser = async () => {
        if (!user || !user.email) return;

        const newUser: CreateUser = {
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
                setUserId(createdUser.id); // Set the newly created user ID
            } else {
                console.error("Failed to create user.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    // Initialize user ID on component mount
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            checkUser(user.email);
        }
    }, [isAuthenticated, user]);

    // Fetch geocode
    const fetchGeocode = async (address: string) => {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
        )}.json?access_token=${MAPBOX_TOKEN}`;

        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data?.features?.[0]) {
                const [lng, lat] = data.features[0].center;
                setLatitude(lat);
                setLongitude(lng);
            } else {
                setLatitude(null);
                setLongitude(null);
            }
        } catch (error) {
            console.error("Failed to fetch geocode data:", error);
        }
    };
    const fetchSuggestions = async (query: string) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data?.features) {
                setSuggestions(data.features); // Update suggestions state with fetched results
            } else {
                setSuggestions([]); // Clear suggestions if none are found
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
        }
    };

    const handleLocationChange = (value: string) => {
        setLocation(value);
        if (value.trim()) {
            fetchSuggestions(value); // Fetch suggestions as the user types
        } else {
            setSuggestions([]); // Clear suggestions if input is empty
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        setLocation(suggestion.place_name); // Set the selected suggestion as the location
        setLatitude(suggestion.center[1]); // Set latitude
        setLongitude(suggestion.center[0]); // Set longitude
        setSuggestions([]); // Clear suggestions after selection
    };

    // Handle event creation
    const handleSave = async () => {
        if (!isAuthenticated) {
            alert("You must be logged in to create an event.");
            return;
        }

        if (!eventTitle || !location || !eventDay || !eventMonth || !startTime || !endTime) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        const eventData = {
            user_id: userId, // Use fetched or created user ID
            event_title: eventTitle,
            location,
            event_day: eventDay,
            event_month: eventMonth,
            start_time: startTime,
            end_time: endTime,
            description,
            max_players: maxPlayers,
            latitude,
            longitude,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/events/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
            });



            const data = await response.json();
            console.log("Event created successfully:", data);
            alert(`Event created successfully with ID: ${data.id}`);
            resetForm();
        } catch (error) {
            console.error("Error during event creation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEventTitle("");
        setLocation("");
        setEventDay("");
        setEventMonth("");
        setStartTime("");
        setEndTime("");
        setDescription("");
        setMaxPlayers(2);
        setLatitude(null);
        setLongitude(null);
    };

    return (
        <div className="container mt-6 flex justify-center items-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full bg-white p-6 shadow-md rounded-lg">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input
                            placeholder="Example: Tourney Thursdays"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>
                    <div className="col-span-2 relative mt-3">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <div className="text-sm text-gray-500 mb-2">
                            Currently, private addresses are not supported in this version. All
                            locations will be visible to everyone. Please select a public location. Thank you!
                        </div>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            placeholder="Enter a location"
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
                                {suggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.id}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {suggestion.place_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Day</label>
                        <input
                            placeholder="E.g., 25"
                            value={eventDay}
                            onChange={(e) => setEventDay(e.target.value)}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Month</label>
                        <input
                            placeholder="E.g., November"
                            value={eventMonth}
                            onChange={(e) => setEventMonth(e.target.value)}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <MaskedInput
                            mask={[/\d/, /\d/, ":", /\d/, /\d/, " ", /[aApP]/, /[mM]/]}
                            placeholder="08:00 am"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            guide={false}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <MaskedInput
                            mask={[/\d/, /\d/, ":", /\d/, /\d/, " ", /[aApP]/, /[mM]/]}
                            placeholder="08:30 am"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            guide={false}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            placeholder="Event description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Players</label>
                        <input
                            placeholder="2"
                            type="number"
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(Number(e.target.value))}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>
                    <div className="col-span-2 mt-3">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGame;
