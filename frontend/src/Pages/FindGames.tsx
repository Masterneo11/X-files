import Map, { Marker } from 'react-map-gl';
import React, { useState, useEffect } from 'react';
import MyMap from '../Components/MyMap'; // Import the MyMap component

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Event {
    latitude: number;
    longitude: number;
    name: string;
    id: string;
}

const FindGames: React.FC = () => {
    const [latitude, setLatitude] = useState<number>(37.0965);
    const [longitude, setLongitude] = useState<number>(-113.5684);
    const [eventName, setEventName] = useState<string>("Loading Event...");
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Event[] | []>([]);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/events/Event`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data: Event[] = await response.json();
                setData(data)
                // if (latitude !== undefined && longitude !== undefined) {
                //     setLatitude(parseFloat(data.latitude.toString()));
                //     setLongitude(parseFloat(data.longitude.toString()));
                //     setEventName(data.name); }
                console.log(data)
            } catch (error) {
                console.error('Error fetching event data:', error);
                setError('Failed to load event data. Please try again later.');
            }
        };
        fetchEventData();
    }, []);
    return (
        <>

            {!error && <MyMap points={data} longitude={longitude} latitude={latitude} />}

        </>
    );
}

export default FindGames;

