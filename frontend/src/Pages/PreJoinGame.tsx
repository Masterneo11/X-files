import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Event {
    id: number;
    event_title: string;
    location: string;
    latitude?: number;
    longitude?: number;
    start_time: string;
    end_time: string;
    description?: string;
    max_players: number;
    user_id: number;
    event_owner: string;
}

interface Attendee {
    id: number;
    name: string;
    email: string;
    username: string;
}

const PreJoinGame: React.FC = () => {
    const { event_id } = useParams<{ event_id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loggedInUserId = 1; // Replace with actual logic to get logged-in user's ID

    const fetchEventById = async (eventId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/events/events/${eventId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setEvent(data);
            } else {
                setError("Failed to fetch event details.");
            }
        } catch (error) {
            console.error("Error fetching event:", error);
            setError("An error occurred while fetching the event.");
        }
    };

    const fetchEventAttendees = async (eventId: number) => {
        try {
            const response = await fetch(`http://localhost:8000/events/events/${eventId}/attendees`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setAttendees(data);
            } else {
                setError("Failed to fetch attendees.");
            }
        } catch (error) {
            console.error("Error fetching attendees:", error);
            setError("An error occurred while fetching the attendees.");
        }
    };

    const handleJoinEvent = async () => {
        try {
            const response = await fetch(`http://localhost:8000/events/events/${event_id}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: loggedInUserId }),
            });

            if (response.ok) {
                const newAttendee = await response.json();
                setAttendees((prev) => [...prev, newAttendee]);
            } else {
                setError("Failed to join the event.");
            }
        } catch (error) {
            console.error("Error joining event:", error);
            setError("An error occurred while joining the event.");
        }
    };

    useEffect(() => {
        if (event_id) {
            fetchEventById(event_id);
            fetchEventAttendees(Number(event_id));
        }
        setLoading(false);
    }, [event_id]);

    if (loading) {
        return <div>Loading event details...</div>;
    }

    if (!event) {
        return <div>No event found.</div>;
    }

    const generateMapLink = () => {
        if (event.latitude && event.longitude) {
            return `https://www.google.com/maps?q=${event.latitude},${event.longitude}`;
        } else {
            const query = encodeURIComponent(event.location);
            return `https://www.google.com/maps?q=${query}`;
        }
    };

    return (
        <div>
            {/* Event Details */}
            <div className="p-6 border border-gray-200 bg-white rounded shadow-md mb-8">
                <h2 className="text-2xl font-bold text-green-600 mb-4">{event.event_title}</h2>
                <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Location:</strong>
                        <a
                            href={generateMapLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            {event.location}
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Start Time:</strong>
                        <span>{new Date(event.start_time).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600">End Time:</strong>
                        <span>{new Date(event.end_time).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Max Players:</strong>
                        <span>{event.max_players}</span>
                    </div>
                </div>
                <div>
                    <strong className="text-gray-600">Description:</strong>
                    <p className="text-gray-800">
                        {event.description || "No description available."}
                    </p>
                </div>
                <button
                    onClick={handleJoinEvent}
                    className="mt-4 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Join Event
                </button>
            </div>

            {/* Attendees */}
            <div className="p-4 border border-gray-200 bg-white rounded shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-6">Attendees</h3>
                {attendees.length > 0 ? (
                    <div className="flex flex-col gap-1 sm:gap-4">
                        {attendees.map((attendee) => (
                            <div
                                key={attendee.id}
                                className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded p-3"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                        <span>👤</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm sm:text-base">
                                            {attendee.name}
                                        </span>
                                        <br />
                                        <span className="text-gray-500 text-xs sm:text-sm">
                                            {attendee.username}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No attendees for this event.</p>
                )}
            </div>
        </div>
    );
};

export default PreJoinGame;
