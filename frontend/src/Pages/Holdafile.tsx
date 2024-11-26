// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";

// interface Event {
//     id: number;
//     event_title: string;
//     location: string;
//     latitude?: number;
//     longitude?: number;
//     start_time: string;
//     end_time: string;
//     description?: string;
//     max_players: number;
//     user_id: number;
//     creator: { username: string } | null;
//     event_day: string;
//     event_month: string;
// }

// interface Attendee {
//     id: number;
//     name: string;
//     email: string;
//     username: string;
// }

// const FullGameInfo: React.FC = () => {
//     const { event_id } = useParams<{ event_id: string }>();
//     const { user, isAuthenticated } = useAuth0();
//     const [event, setEvent] = useState<Event | null>(null);
//     const [attendees, setAttendees] = useState<Attendee[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const navigate = useNavigate();

//     const userId = user?.sub || null; // Unique user ID from Auth0

//     // Fetch event details and attendees
//     const fetchEventData = async (eventId: string) => {
//         try {
//             setLoading(true);

//             const [eventResponse, attendeesResponse] = await Promise.all([
//                 fetch(`http://localhost:8000/events/events/${eventId}`, {
//                     method: "GET",
//                     headers: { "Content-Type": "application/json" },
//                 }),
//                 fetch(`http://localhost:8000/events/events/${eventId}/attendees`, {
//                     method: "GET",
//                     headers: { "Content-Type": "application/json" },
//                 }),
//             ]);

//             if (eventResponse.ok && attendeesResponse.ok) {
//                 const eventData = await eventResponse.json();
//                 const attendeesData = await attendeesResponse.json();

//                 setEvent(eventData);
//                 setAttendees(attendeesData);
//             } else {
//                 setError("Failed to fetch event details or attendees.");
//             }
//         } catch (error) {
//             console.error("Error fetching event data:", error);
//             setError("An error occurred while fetching event data.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Leave the event
//     const leaveEvent = async () => {
//         if (!userId) {
//             alert("You must be logged in to leave the event.");
//             return;
//         }

//         try {
//             const response = await fetch(
//                 `http://localhost:8000/events/events/${event_id}/remove_user/${userId}`,
//                 {
//                     method: "DELETE",
//                     headers: { "Content-Type": "application/json" },
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 alert(data.message);

//                 // Update attendees list
//                 setAttendees((prevAttendees) =>
//                     prevAttendees.filter((attendee) => attendee.id !== Number(userId))
//                 );
//             } else {
//                 const errorData = await response.json();
//                 alert(errorData.detail || "Failed to leave the event.");
//             }
//         } catch (error) {
//             console.error("Error leaving event:", error);
//             alert("An error occurred while leaving the event.");
//         }
//     };

//     // Generate Google Maps link
//     const generateGoogleMapsLink = async () => {
//         if (event?.latitude && event?.longitude) {
//             return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
//         } else {
//             return `https://www.google.com/maps/search/?q=${encodeURIComponent(event?.location || "")}`;
//         }
//     };

//     useEffect(() => {
//         if (event_id) {
//             fetchEventData(event_id);
//         }
//     }, [event_id]);

//     if (loading) {
//         return <div>Loading event details...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!event) {
//         return <div>No event found.</div>;
//     }

//     return (
//         <div>
//             {/* Event Details */}
//             <div className="p-6 border border-gray-200 bg-white rounded shadow-md mb-8">
//                 <div className="text-2xl font-bold flex items-center gap-2">
//                     Event hosted by:{" "}
//                     <span className="text-green-600">{event.creator?.username || "Unknown"}</span>
//                 </div>
//                 <h2 className="text-2xl font-bold text-green-600 mb-4">{event.event_title}</h2>
//                 <div className="flex flex-wrap gap-6 mb-6">
//                     <div className="flex flex-col">
//                         <strong className="text-gray-600">Location:</strong>
//                         <button
//                             onClick={async () => {
//                                 const link = await generateGoogleMapsLink();
//                                 window.open(link, "_blank");
//                             }}
//                             className="text-blue-600 underline hover:text-blue-800"
//                         >
//                             {event.location}
//                         </button>
//                     </div>
//                     <div className="flex flex-col">
//                         <strong className="text-gray-600">Start Time:</strong>
//                         <span>{new Date(event.start_time).toLocaleString()}</span>
//                     </div>
//                     <div className="flex flex-col">
//                         <strong className="text-gray-600">End Time:</strong>
//                         <span>{new Date(event.end_time).toLocaleString()}</span>
//                     </div>
//                     <div className="flex flex-col">
//                         <strong className="text-gray-600">Event Day:</strong>
//                         <span>{event.event_day}</span>
//                     </div>
//                     <div className="flex flex-col">
//                         <strong className="text-gray-600">Event Month:</strong>
//                         <span>{event.event_month}</span>
//                     </div>
//                 </div>
//                 <div>
//                     <strong className="text-gray-600">Description:</strong>
//                     <p className="text-gray-800">{event.description || "No description available."}</p>
//                 </div>
//                 <button
//                     onClick={leaveEvent}
//                     className="mt-4 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                     Leave Event
//                 </button>
//             </div>

//             {/* Attendees */}
//             <div className="p-4 border border-gray-200 bg-white rounded shadow-md">
//                 <h3 className="text-xl font-bold text-blue-600 mb-6">Attendees</h3>
//                 {attendees.length > 0 ? (
//                     <div className="flex flex-col gap-4">
//                         {attendees.map((attendee) => (
//                             <div
//                                 key={attendee.id}
//                                 className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded p-3"
//                             >
//                                 <div className="flex items-center">
//                                     <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
//                                         👤
//                                     </div>
//                                     <div>
//                                         <span className="font-semibold">{attendee.name}</span>
//                                         <br />
//                                         <span className="text-gray-500 text-sm">{attendee.username}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p>No attendees for this event.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FullGameInfo;


// import React, { useState } from "react";
// import MaskedInput from "react-text-mask";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// // import "./datepicker-tailwind.css"; // Optional: Custom Tailwind styling for DatePicker

// const CreateGame: React.FC = () => {
//     const [eventTitle, setEventTitle] = useState<string>("");
//     const [location, setLocation] = useState<string>("");
//     const [eventDate, setEventDate] = useState<Date | null>(null); // Updated to store full date
//     const [startTime, setStartTime] = useState<string>("");
//     const [endTime, setEndTime] = useState<string>("");
//     const [description, setDescription] = useState<string>("");
//     const [maxPlayers, setMaxPlayers] = useState<number>(2);
//     const [latitude, setLatitude] = useState<number | null>(null);
//     const [longitude, setLongitude] = useState<number | null>(null);
//     const [user_id, setUser_id] = useState<number>(0);
//     const [suggestions, setSuggestions] = useState<any[]>([]);

//     const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZG9wZW5lbyIsImEiOiJjbTM0bzMzd2owMXQ1MmpvaTJ2cHVjNmF4In0.gCWzwPccdoe4WXPCqEbxKg";

//     const fetchGeocode = async (address: string) => {
//         const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             address
//         )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;

//         try {
//             const response = await fetch(geocodeUrl);
//             const data = await response.json();
//             if (data?.features?.[0]) {
//                 const [lng, lat] = data.features[0].center;
//                 setLatitude(lat);
//                 setLongitude(lng);
//             } else {
//                 setLatitude(null);
//                 setLongitude(null);
//             }
//         } catch (error) {
//             console.error("Failed to fetch geocode data:", error);
//         }
//     };

//     const fetchSuggestions = async (query: string) => {
//         const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             query
//         )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`;

//         try {
//             const response = await fetch(url);
//             const data = await response.json();
//             setSuggestions(data?.features || []);
//         } catch (error) {
//             console.error("Error fetching autocomplete suggestions:", error);
//         }
//     };

//     const handleLocationChange = (value: string) => {
//         setLocation(value);
//         if (value.trim()) {
//             fetchSuggestions(value);
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const handleSuggestionClick = (suggestion: any) => {
//         setLocation(suggestion.place_name);
//         setLatitude(suggestion.center[1]);
//         setLongitude(suggestion.center[0]);
//         setSuggestions([]);
//     };

//     const handleSave = async () => {
//         const eventData = {
//             user_id,
//             event_title: eventTitle,
//             location,
//             event_day: eventDate?.getDate() || "", // Get day from selected date
//             event_month: eventDate?.toLocaleString("default", { month: "long" }) || "", // Get month name
//             start_time: startTime,
//             end_time: endTime,
//             description,
//             max_players: maxPlayers,
//             latitude,
//             longitude,
//         };

//         try {
//             const response = await fetch(`http://localhost:8000/events/events`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(eventData),
//             });

//             if (!response.ok) {
//                 console.error("Failed to create event:", response.statusText);
//                 return;
//             }

//             const data = await response.json();
//             console.log("Event created successfully:", data);

//             resetForm();
//         } catch (error) {
//             console.error("Error during event creation:", error);
//         }
//     };

//     const resetForm = () => {
//         setEventTitle("");
//         setLocation("");
//         setEventDate(null);
//         setStartTime("");
//         setEndTime("");
//         setDescription("");
//         setMaxPlayers(2);
//         setLatitude(null);
//         setLongitude(null);
//         setSuggestions([]);
//     };

//     return (
//         <div className="container mt-6 flex justify-center items-center w-full">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full bg-white p-6 shadow-md rounded-lg">
//                 <form
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         handleSave();
//                     }}
//                 >
//                     <div className="col-span-2">
//                         <label className="block text-sm font-medium text-gray-700">Event Title</label>
//                         <input
//                             placeholder="Example: Tourney Thursdays"
//                             value={eventTitle}
//                             onChange={(e) => setEventTitle(e.target.value)}
//                             className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
//                         />
//                     </div>

//                     <div className="col-span-2 relative mt-3">
//                         <label className="block text-sm font-medium text-gray-700">Location</label>
//                         <input
//                             type="text"
//                             value={location}
//                             onChange={(e) => handleLocationChange(e.target.value)}
//                             placeholder="Enter a location"
//                             className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
//                         />
//                         {suggestions.length > 0 && (
//                             <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
//                                 {suggestions.map((suggestion) => (
//                                     <li
//                                         key={suggestion.id}
//                                         onClick={() => handleSuggestionClick(suggestion)}
//                                         className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                                     >
//                                         {suggestion.place_name}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Event Date</label>
//                         <DatePicker
//                             selected={eventDate}
//                             onChange={(date: Date) => setEventDate(date)}
//                             dateFormat="MMMM d, yyyy"
//                             className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
//                             placeholderText="Select a date"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Start Time</label>
//                         <MaskedInput
//                             mask={[/\d/, /\d/, ":", /\d/, /\d/, " ", /[aApP]/, /[mM]/]}
//                             placeholder="08:00 am"
//                             value={startTime}
//                             onChange={(e) => setStartTime(e.target.value)}
//                             guide={false}
//                             className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
//                         />
//                     </div>

//                     <div className="mt-3">
//                         <label className="block text-sm font-medium text-gray-700">End Time</label>
//                         <MaskedInput
//                             mask={[/\d/, /\d/, ":", /\d/, /\d/, " ", /[aApP]/, /[mM]/]}
//                             placeholder="08:30 am"
//                             value={endTime}
//                             onChange={(e) => setEndTime(e.target.value)}
//                             guide={false}
//                             className="mt-1 p-2 w-full border-2 border-gray-600 rounded-md"
//                         />
//                     </div>

//                     <div className="col-span-2 mt-3">
//                         <button
//                             type="submit"
//                             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                         >
//                             Create Event
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateGame;


