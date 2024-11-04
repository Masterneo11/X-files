import DiceIcon from "../assets/dice-d20.svg"
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import PodiumIcon from "../assets/podium-victory-leader.svg"

interface Event {
    event_title: string;
    location: string;
    start_time: string;
    end_time: string;
    description?: string;
    max_players: number;
    user_id: number;
    event_owner: string;
}

const FullGameInfo = () => {
    const [gameInfo, setGameInfo] = useState(""); // Example useState

    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<Date>();
    const [startTime, setStartTime] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);


    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:8000/events/Event", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error("Failed to fetch event data.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);
    return (
        <div>
            <h1>Full Game Info</h1>

            <h1 className=" flex mr-60">Home</h1>
            {events.map((event, index) => (
                <div key={index} className="p-4 border-gray-200 ">
                    <div className=" text-green  ml-5">{event.event_title}</div>

                    <p>{event.start_time}</p>
                    <p>{event.location}</p>
                    <p>{event.end_time}</p>
                    <p>Description :  {event.description}</p>

                    <p>Attending players not yet rending how to render? </p>

                    <div className=" flex justify-between">




                    </div>
                </div>
            ))}
        </div>



    );
}

export default FullGameInfo;
