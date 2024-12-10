import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import EyeIcon from '../assets/image.png'; // Adjust the path if needed

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Event {
    latitude: number;
    longitude: number;
    name: string;
    description?: string;
    id: string; // Unique ID for the event to construct event detail URLs
}

interface MyMapProps {
    latitude: number;
    longitude: number;
    points: Event[];
}

const MyMap: React.FC<MyMapProps> = ({ latitude, longitude, points }) => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleEventClick = (eventId: string) => {
        window.location.href = `/event/${eventId}`; // Navigate to event detail
    };

    return (
        <Map
            initialViewState={{
                longitude,
                latitude,
                zoom: 12,
            }}
            style={{ width: '100%', height: '1000px' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onClick={() => setSelectedEvent(null)} // Deselect event on map click
        >
            {points.map((item, idx) => (
                <Marker
                    key={idx}
                    latitude={item.latitude}
                    longitude={item.longitude}
                    anchor="bottom"
                    onClick={(e) => {
                        e.originalEvent.stopPropagation(); // Prevent event bubbling
                        setSelectedEvent(item); // Set selected event
                    }}
                >
                    <img
                        src={EyeIcon}
                        alt="Custom Marker"
                        style={{
                            height: '40px',
                            width: '40px',
                            cursor: 'pointer',
                        }}
                    />
                </Marker>
            ))}

            {selectedEvent && (
                <Popup
                    longitude={selectedEvent.longitude}
                    latitude={selectedEvent.latitude}
                    anchor="top"
                    closeOnClick={false}
                    onClose={() => setSelectedEvent(null)}
                >
                    <div>
                        <h3>{selectedEvent.name}</h3>
                        <p>{selectedEvent.description || 'No description available'}</p>
                        <button
                            onClick={() => handleEventClick(selectedEvent.id)}
                            style={{
                                marginTop: '10px',
                                padding: '6px 12px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            View Event Details
                        </button>
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default MyMap;




// import React, { useState } from 'react';
// import Map, { Marker, Popup } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import EyeIcon from '../assets/image.png'; // Adjust the import path if needed
// import mapboxgl from 'mapbox-gl';

// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// interface Event {
//     latitude: number;
//     longitude: number;
//     name: string;
//     description?: string;
//     id: string; // Unique ID for the event to construct event detail URLs
// }
// interface MyMapProps {
//     latitude: number;
//     longitude: number;
//     points: Event[];
// }
// const MyMap: React.FC<MyMapProps> = ({ latitude, longitude, points }) => {
//     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//     const handleEventClick = (eventId: string) => {
//         // Navigate to the full event details page
//         window.location.href = `/event/${eventId}`; // Adjust the URL structure as needed
//     };

//     return (
//         <Map
//             initialViewState={{
//                 longitude: longitude,
//                 latitude: latitude,
//                 zoom: 12,
//             }}
//             style={{ width: '100%', height: '1000px' }}
//             mapStyle="mapbox://styles/mapbox/streets-v11"
//             // mapbox://styles/dopeneo/cm34pc8l6002b01ptes95ck1k    // mapStyle="mapbox://styles/mapbox/streets-v11"

//             mapboxAccessToken={MAPBOX_TOKEN}
//             onClick={() => setSelectedEvent(null)} // Close popup on map click
//         >
//             {points.map((item, idx) => (
//                 <Marker
//                     key={idx}
//                     latitude={item.latitude}
//                     longitude={item.longitude}
//                     onClick={(e) => {
//                         e.originalEvent.stopPropagation();
//                         setSelectedEvent(item);
//                     }}
//                 >
//                     <img
//                         src={EyeIcon}
//                         alt="Custom Marker"
//                         style={{
//                             height: '80x',
//                             width: '45px',
//                             cursor: 'pointer',
//                         }}
//                     />
//                 </Marker>
//             ))}

//             {selectedEvent && (
//                 <Popup
//                     longitude={selectedEvent.longitude}
//                     latitude={selectedEvent.latitude}
//                     anchor="top"
//                     closeOnClick={false}
//                     onClose={() => setSelectedEvent(null)}
//                 >
//                     <div>
//                         <h3>{selectedEvent.name}</h3>
//                         <p>{selectedEvent.description || 'No description available'}</p>
//                         <button
//                             onClick={() => handleEventClick(selectedEvent.id)}
//                             style={{
//                                 marginTop: '10px',
//                                 padding: '6px 12px',
//                                 backgroundColor: '#007bff',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             View Event Details
//                         </button>
//                     </div>
//                 </Popup>
//             )}
//         </Map>
//     );
// };

// export default MyMap;