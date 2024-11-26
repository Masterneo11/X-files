import React, { useState } from "react";
import MaskedInput from "react-text-mask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateGame: React.FC = () => {
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
    const [user_id, setUser_id] = useState<number>(0);
    const [suggestions, setSuggestions] = useState<any[]>([]); // Store autocomplete suggestions

    const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZG9wZW5lbyIsImEiOiJjbTM0bzMzd2owMXQ1MmpvaTJ2cHVjNmF4In0.gCWzwPccdoe4WXPCqEbxKg";

    const fetchGeocode = async (address: string) => {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

        try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data?.features?.[0]) {
                const [lng, lat] = data.features[0].center;
                setLatitude(lat);
                setLongitude(lng);
                console.log(`Geocoded Address: Latitude ${lat}, Longitude ${lng}`);
            } else {
                console.error("No geocode results found.");
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
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`;

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

    const handleSave = async () => {
        const eventData = {
            user_id,
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
            const response = await fetch(`http://localhost:8000/events/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                console.error("Failed to create event:", response.statusText);
                return;
            }

            const data = await response.json();
            console.log("Event created successfully:", data);

            resetForm();
        } catch (error) {
            console.error("Error during event creation:", error);
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
        setSuggestions([]);
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
                            className="mt- p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>

                    <div className="col-span-2 relative mt-3">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            id="location-input"
                            value={location}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            placeholder="Enter a location"
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                        {/* Suggestions Dropdown */}
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
                        {/* <DatePicker
                            selected={eventDay}
                            onChange={(date: Date) => setEventDay(date)}
                            dateFormat="MMMM d, yyyy"
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                            placeholderText="Select a date"
                        /> */}
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

                    <div className="mt-3">
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

                    <div className="col-span-2 mt-3">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 w-full border-2  border-gray-600 rounded-md"
                            placeholder="A fun tournament!"
                        />
                    </div>

                    <div className="mt-3">
                        <label className="block text-sm  font-medium text-gray-700">Max Players</label>
                        <input
                            type="number"
                            placeholder="E.g., 10"
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(Number(e.target.value))}
                            className="mt-1 p-2 w-full border-2  border-gray-600 rounded-md"
                        />
                    </div>

                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">User ID</label>
                        <input
                            type="number"
                            placeholder="1"
                            value={user_id}
                            onChange={(e) => setUser_id(Number(e.target.value))}
                            className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
                        />
                    </div>

                    <div className="col-span-2 mt-3">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGame;



