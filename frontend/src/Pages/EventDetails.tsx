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
    event_month: string;
    creator: string;
    event_day: string;
}
interface Attendee {
    id: number;
    name: string;
    email: string;
    username: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EventDetails: React.FC = () => {
    const { event_id } = useParams<{ event_id: string }>();

    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated } = useAuth0();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userMessage, setUserMessage] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const navigate = useNavigate();

    const loggedInUserId = user?.sub || null;

    useEffect(() => {
        let isMounted = true; // Tracks if the component is still mounted

        const fetchEventDetails = async () => {
            try {
                if (!id) return;

                setLoading(true);

                const eventResponse = await fetch(`${API_BASE_URL}/events/events/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const attendeesResponse = await fetch(`${API_BASE_URL}/events/events/${id}/attendees`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (isMounted) {
                    if (eventResponse.ok) {
                        setEvent(await eventResponse.json());
                    } else {
                        setError("Failed to fetch event details.");
                    }

                    if (attendeesResponse.ok) {
                        setAttendees(await attendeesResponse.json());
                    } else {
                        setError("Failed to fetch attendees.");
                    }
                }
            } catch (err) {
                if (isMounted) setError("An error occurred while fetching event details.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchEventDetails();

        return () => {
            isMounted = false; // Cleanup to prevent setting state on unmounted component
        };
    }, [id]);

    useEffect(() => {
        const fetchUserId = async () => {
            if (!isAuthenticated || !user?.email) return;

            try {
                const response = await fetch(`${API_BASE_URL}/users/by-email/${user.email}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData.id);
                } else {
                    setError("Failed to fetch user information.");
                }
            } catch (err) {
                console.error("Error fetching user ID:", err);
                setError("An error occurred while fetching the user ID.");
            }
        };

        fetchUserId();
    }, [isAuthenticated, user]);

    const addUserToEvent = async () => {
        if (!isAuthenticated || !userId) {
            setUserMessage("You must be logged in to join the event.");
            return;
        }

        setUserMessage(null);
        try {
            const response = await fetch(`${API_BASE_URL}/events/events/${id}/add_user/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                setUserMessage(data.message || "You successfully joined the event.");
                // Refetch attendees to update the list
                const attendeesResponse = await fetch(`${API_BASE_URL}/events/events/${id}/attendees`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (attendeesResponse.ok) {
                    setAttendees(await attendeesResponse.json());
                }
            } else {
                const errorData = await response.json();
                setUserMessage(errorData.detail || "Failed to join the event.");
            }
        } catch (err) {
            console.error("Error adding user to event:", err);
            setUserMessage("An error occurred while joining the event.");
        }
    };

    const handleProfileClick = (attendeeId: number) => {
        navigate(`/users/${attendeeId}`);
    };

    const handleMessageClick = (attendeeId: number) => {
        if (!loggedInUserId) {
            alert("You must be logged in to send messages.");
            return;
        }
        navigate(`/messages/${loggedInUserId}/${attendeeId}`);
    };

    const handleJoinEvent = async () => {
        console.log("handleJoinEvent triggered", { event_id, loggedInUserId });

        if (!event_id || !loggedInUserId) {
            console.error("Missing eventId or loggedInUserId", { event_id, loggedInUserId });
            setError("Event ID or logged-in user ID is missing.");
            return;
        }

        try {
            console.log(`Making API call to: ${API_BASE_URL}/events/events/${event_id}/add_user/${loggedInUserId}`);
            const response = await fetch(
                `${API_BASE_URL}/events/events/${event_id}/add_user/${loggedInUserId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const newAttendee = await response.json();
                setAttendees((prev) => [...prev, newAttendee]);
                setUserMessage("Successfully joined the event!");
            } else {
                const errorData = await response.json();
                setUserMessage(errorData.detail || "Failed to join the event.");
            }
        } catch (error) {
            console.error("Error joining event:", error);
            setError("An error occurred while joining the event.");
        }
    };


    const generateMapboxLink = async () => {
        if (event?.latitude && event?.longitude) {
            return new Promise<string>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject("Geolocation is not supported by this browser.");
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLatitude = position.coords.latitude;
                        const userLongitude = position.coords.longitude;
                        const mapboxLink = `https://www.mapbox.com/directions/?origin=${userLatitude},${userLongitude}&destination=${event.latitude},${event.longitude}`;
                        resolve(mapboxLink);
                    },
                    (error) => {
                        console.error("Error getting user location:", error);
                        reject("Unable to retrieve your location.");
                    }
                );
            });
        } else {
            return `https://www.mapbox.com/directions/?destination=${encodeURIComponent(event?.location || "")}`;
        }
    };


    // const generateGoogleMapsLink = async () => {
    //     if (event?.latitude && event?.longitude) {
    //         return new Promise<string>((resolve, reject) => {
    //             if (!navigator.geolocation) {
    //                 reject("Geolocation is not supported by this browser.");
    //             }

    //             navigator.geolocation.getCurrentPosition(
    //                 (position) => {
    //                     const userLatitude = position.coords.latitude;
    //                     const userLongitude = position.coords.longitude;
    //                     const googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${event.latitude},${event.longitude}`;
    //                     resolve(googleMapsLink);
    //                 },
    //                 (error) => {
    //                     console.error("Error getting user location:", error);
    //                     reject("Unable to retrieve your location.");
    //                 }
    //             );
    //         });
    //     } else {
    //         return `https://www.google.com/maps/search/?q=${encodeURIComponent(event?.location || "")}`;
    //     }
    // };

    if (loading) {
        return <div>Loading event details...</div>;
    }

    if (!event) {
        return <div>No event found.</div>;
    }

    return (
        <div>
            <div className="p-6 border border-gray-200 bg-white rounded shadow-md mb-8">
                <div className=" text-2xl font-bold max-w-fit flex w-80px justify-between text-gray-600">Event hosted by
                    {Object.entries(event.creator || {})
                        .filter(([key]) => key === "username")
                        .map(([_, value]) => (
                            <div className="ml-2 text-green-600" key="username">{value}
                            </div>
                        ))}

                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">{event.event_title}</h2>
                <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Location:</strong>
                        <button
                            onClick={async () => {
                                try {
                                    const mapboxLink = await generateMapboxLink();
                                    window.open(mapboxLink, "_blank");
                                } catch (error) {
                                    alert(error);
                                }
                            }}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {event.location}
                        </button>

                        {/* <button
                            onClick={async () => {
                                try {
                                    const googleMapsLink = await generateGoogleMapsLink();
                                    window.open(googleMapsLink, "_blank");
                                } catch (error) {
                                    alert(error);
                                }
                            }}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {event.location}
                        </button> */}
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600">Start Time:</strong>
                        <span>{event.start_time}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600">End Time:</strong>
                        <span>{event.end_time}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600"></strong>
                        <span>{event.event_day}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-gray-600"></strong>
                        <span>{event.event_month}</span>
                    </div>
                </div>
                <div>
                    <strong className="text-gray-600">Description:</strong>
                    <p className="text-gray-800">
                        {event.description || "No description available."}
                    </p>
                </div>
                <button
                    onClick={addUserToEvent}
                    className="mt-4 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Join Event
                </button>
            </div>
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

export default EventDetails;
