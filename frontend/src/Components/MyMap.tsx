// src/components/MyMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import EyeIcon from '../assets/image.png'; // Replace with your marker image path

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Event {
    latitude: number;
    longitude: number;
    name: string;
    description?: string;
    id: string;
}

interface MyMapProps {
    latitude: number;
    longitude: number;
    points: Event[];
}

const MyMap: React.FC<MyMapProps> = ({ latitude, longitude, points }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!, // Reference to map container
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 12,
            accessToken: MAPBOX_TOKEN,
        });

        // Add Markers
        points.forEach((point) => {
            const markerElement = document.createElement('img');
            markerElement.src = EyeIcon;
            markerElement.style.width = '40px';
            markerElement.style.height = '40px';
            markerElement.style.cursor = 'pointer';

            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat([point.longitude, point.latitude])
                .addTo(map);

            // Add Click Listener to Marker
            markerElement.addEventListener('click', () => {
                setSelectedEvent(point);

                if (popupRef.current) {
                    popupRef.current.remove();
                }

                const popup = new mapboxgl.Popup({ closeOnClick: false })
                    .setLngLat([point.longitude, point.latitude])
                    .setHTML(
                        `<div>
                            <h3>${point.name}</h3>
                            <p>${point.description || 'No description available'}</p>
                            <button id="view-details-${point.id}" style="
                                margin-top: 10px;
                                padding: 6px 12px;
                                background-color: #007bff;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            ">View Event Details</button>
                        </div>`
                    )
                    .addTo(map);

                popupRef.current = popup;

                setTimeout(() => {
                    const detailButton = document.getElementById(`view-details-${point.id}`);
                    detailButton?.addEventListener('click', () => {
                        window.location.href = `/event/${point.id}`;
                    });
                }, 0);
            });
        });

        // Cleanup on Component Unmount
        return () => {
            if (popupRef.current) {
                popupRef.current.remove();
            }
            map.remove();
        };
    }, [latitude, longitude, points]);

    return (
        <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '1000px' }}
        ></div>
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