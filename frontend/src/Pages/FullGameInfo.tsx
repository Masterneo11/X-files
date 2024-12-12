import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

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
    creator: { username: string } | null;
    event_day: string;
    event_month: string;
}

interface Attendee {
    id: number;
    name: string;
    email: string;
    username: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;


const FullGameInfo: React.FC = () => {
    const { event_id } = useParams<{ event_id: string }>();
    const { user, isAuthenticated } = useAuth0();
    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const userId = user?.sub || null; // Unique user ID from Auth0

    // Fetch event details and attendees
    const fetchEventData = async (eventId: string) => {
        try {
            setLoading(true);

            const [eventResponse, attendeesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/events/events/${eventId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
                fetch(`${API_BASE_URL}/events/events/${eventId}/attendees`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
            ]);

            if (eventResponse.ok && attendeesResponse.ok) {
                const eventData = await eventResponse.json();
                const attendeesData = await attendeesResponse.json();

                setEvent(eventData);
                setAttendees(attendeesData);
            } else {
                setError("Failed to fetch event details or attendees.");
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
            setError("An error occurred while fetching event data.");
        } finally {
            setLoading(false);
        }
    };
    const fetchDatabaseUserId = async (auth0Sub: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/get_user_id?sub=${auth0Sub}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Resolved user ID:", data.user_id); // Debugging line
                return data.user_id; // Return the numeric user ID
            } else {
                const errorData = await response.json();
                console.error("Error response from /get_user_id:", errorData);
                return null;
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            return null;
        }
    };
    const leaveEvent = async () => {
        if (!user?.email) {
            alert("You must be logged in to leave the event.");
            return;
        }

        try {
            // Use email as user ID
            const response = await fetch(
                `${API_BASE_URL}/events/events/${event_id}/remove_user/${user.email}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.ok) {
                const data = await response.json();
                alert(data.message);

                // Update attendees list
                setAttendees((prevAttendees) =>
                    prevAttendees.filter((attendee) => attendee.email !== user.email)
                );
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "Failed to leave the event.");
            }
        } catch (error) {
            console.error("Error leaving event:", error);
            alert("An error occurred while leaving the event.");
        }
    };


    const handleMessageClick = (attendeeId: number) => {
        if (!userId) {
            alert("You must be logged in to send messages.");
            return;
        }
        navigate(`/messages/${userId}/${attendeeId}`);
    };

    // Generate Mapbox navigation link
    const generateMapboxLink = async () => {
        const accessToken = MAPBOX_TOKEN; // Replace with your Mapbox access token
        if (event?.latitude && event?.longitude) {
            return `https://www.mapbox.com/directions/?api=1&waypoints=${event.latitude},${event.longitude}&access_token=${accessToken}`;
        } else {
            return `https://www.mapbox.com/search/?q=${encodeURIComponent(event?.location || "")}&access_token=${accessToken}`;
        }
    };

    // Generate Google Maps link
    // const generateGoogleMapsLink = async () => {
    //     if (event?.latitude && event?.longitude) {
    //         return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
    //     } else {
    //         return `https://www.google.com/maps/search/?q=${encodeURIComponent(event?.location || "")}`;
    //     }
    // };
    const handleProfileClick = (attendeeId: number) => {
        navigate(`/users/${attendeeId}`);
    };

    useEffect(() => {
        if (event_id) {
            fetchEventData(event_id);
        }
    }, [event_id]);

    if (loading) {
        return <div>Loading event details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!event) {
        return <div>No event found.</div>;
    }

    return (
        <div>
            {/* Event Details */}
            <div className="p-6 border border-gray-200 bg-white rounded shadow-md mb-8">
                <div className="text-2xl font-bold flex items-center gap-2">
                    Event hosted by:{" "}
                    <span className="text-green-600">{event.creator?.username || "Unknown"}</span>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">{event.event_title}</h2>
                <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Location:</strong>
                        <button
                            onClick={async () => {
                                const link = await generateMapboxLink();
                                window.open(link, "_blank");
                            }}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {event.location}
                        </button>

                        {/* <button
                            onClick={async () => {
                                const link = await generateGoogleMapsLink();
                                window.open(link, "_blank");
                            }}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {event.location}
                        </button> */}
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
                        <strong className="text-gray-600">Event Day:</strong>
                        <span>{event.event_day}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Event Month:</strong>
                        <span>{event.event_month}</span>
                    </div>
                </div>
                <div>
                    <strong className="text-gray-600">Description:</strong>
                    <p className="text-gray-800">{event.description || "No description available."}</p>
                </div>
                <button
                    onClick={leaveEvent}
                    className="mt-4 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Leave Event
                </button>
            </div>

            {/* Attendees */}
            <div className="p-4 border border-gray-200 bg-white rounded shadow-md">
                <h3 className="text-xl font-bold text-blue-600 mb-6">Attendees</h3>
                {attendees.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {attendees.map((attendee) => (
                            <div
                                key={attendee.id}
                                className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded p-3"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                        👤
                                    </div>
                                    <div>
                                        <span className="font-semibold">{attendee.name}</span>
                                        <br />
                                        <span className="text-gray-500 text-sm">{attendee.username}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <button
                                        onClick={() => handleMessageClick(attendee.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 sm:px-3 rounded text-xs sm:text-sm"
                                    >
                                        Message
                                    </button>
                                    <button
                                        onClick={() => handleProfileClick(attendee.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:px-3 rounded text-xs sm:text-sm"
                                    >
                                        View Profile
                                    </button>
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

export default FullGameInfo;
